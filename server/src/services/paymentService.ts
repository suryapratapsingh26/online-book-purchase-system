import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { OrderStatus, PaymentStatus } from '../generated/prisma/client';
import prisma from '../lib/prisma';
import {
  getRazorpayKeyId,
  getRazorpayKeySecret,
} from '../config';
import { AppError } from '../middlewares/errorHandler';

const toPaise = (amount: { toString(): string }): number => {
  const value = amount.toString();
  const [rupees, paise = ''] = value.split('.');
  const paiseValue = `${paise}00`.slice(0, 2);
  const result = Number(`${rupees}${paiseValue}`);

  if (!Number.isSafeInteger(result)) {
    throw new AppError(500, 'INVALID_ORDER_AMOUNT', 'Order amount is invalid');
  }

  return result;
};

const getRazorpay = () =>
  new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });

export const createPaymentOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: { id: true, amount: true, status: true },
  });

  if (!order) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new AppError(409, 'ORDER_NOT_PENDING', 'Order is not pending payment');
  }

  const razorpayOrder = await getRazorpay().orders.create({
    amount: toPaise(order.amount),
    currency: 'INR',
    receipt: order.id,
  });

  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    create: {
      orderId: order.id,
      gatewayOrderId: razorpayOrder.id,
      amount: order.amount,
      status: PaymentStatus.PENDING,
    },
    update: {
      gatewayOrderId: razorpayOrder.id,
      gatewayPaymentId: null,
      amount: order.amount,
      status: PaymentStatus.PENDING,
    },
    select: { id: true, gatewayOrderId: true, amount: true, status: true },
  });

  return {
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: getRazorpayKeyId(),
    paymentId: payment.id,
    orderId: order.id,
  };
};

type VerifyPaymentInput = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export const verifyPayment = async (
  userId: string,
  { razorpayOrderId, razorpayPaymentId, razorpaySignature }: VerifyPaymentInput
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      gatewayOrderId: razorpayOrderId,
      order: { userId },
    },
    select: { id: true, orderId: true, status: true, order: { select: { status: true } } },
  });

  if (!payment) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  }

  if (payment.order.status !== OrderStatus.PENDING) {
    throw new AppError(409, 'ORDER_NOT_PENDING', 'Order is not pending payment');
  }

  const expectedSignature = crypto
    .createHmac('sha256', getRazorpayKeySecret())
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  const expected = Buffer.from(expectedSignature, 'utf8');
  const received = Buffer.from(razorpaySignature, 'utf8');

  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    throw new AppError(400, 'INVALID_PAYMENT_SIGNATURE', 'Payment signature is invalid');
  }

  const updated = await prisma.$transaction(async (transaction) => {
    const order = await transaction.order.updateMany({
      where: { id: payment.orderId, userId, status: OrderStatus.PENDING },
      data: { status: OrderStatus.PAID },
    });

    if (order.count !== 1) {
      throw new AppError(409, 'ORDER_NOT_PENDING', 'Order is not pending payment');
    }

    return transaction.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.VERIFIED,
        gatewayPaymentId: razorpayPaymentId,
      },
      select: { orderId: true, status: true },
    });
  });

  return updated;
};