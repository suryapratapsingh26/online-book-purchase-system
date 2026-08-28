import type { Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const authenticatedUserId = (req: Request) => {
  if (!req.auth?.userId) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication is required');
  }

  return req.auth.userId;
};

const requiredString = (value: unknown, code: string, message: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, code, message);
  }

  return value.trim();
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as { orderId?: unknown };
  const orderId = requiredString(body?.orderId, 'INVALID_ORDER_ID', 'Order ID is required');

  if (!uuidPattern.test(orderId)) {
    throw new AppError(400, 'INVALID_ORDER_ID', 'Order ID must be a valid UUID');
  }

  const paymentOrder = await createPaymentOrder(authenticatedUserId(req), orderId);
  res.status(201).json({ data: paymentOrder });
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as {
    razorpay_order_id?: unknown;
    razorpay_payment_id?: unknown;
    razorpay_signature?: unknown;
  };
  const input = {
    razorpayOrderId: requiredString(
      body?.razorpay_order_id,
      'INVALID_PAYMENT_DATA',
      'Razorpay order ID is required'
    ),
    razorpayPaymentId: requiredString(
      body?.razorpay_payment_id,
      'INVALID_PAYMENT_DATA',
      'Razorpay payment ID is required'
    ),
    razorpaySignature: requiredString(
      body?.razorpay_signature,
      'INVALID_PAYMENT_DATA',
      'Razorpay signature is required'
    ),
  };

  const payment = await verifyPayment(authenticatedUserId(req), input);
  res.json({ data: payment });
};