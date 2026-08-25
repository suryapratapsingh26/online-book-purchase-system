import { OrderStatus, Prisma } from '../generated/prisma/client';
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

const orderSelect = {
  id: true,
  bookId: true,
  userId: true,
  amount: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  book: {
    select: {
      id: true,
      title: true,
      author: true,
      coverImage: true,
    },
  },
} as const;

const toOrderResponse = (order: {
  id: string;
  bookId: string;
  userId: string;
  amount: { toFixed(decimalPlaces: number): string };
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
  };
}) => ({
  id: order.id,
  bookId: order.bookId,
  userId: order.userId,
  amount: order.amount.toFixed(2),
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  book: order.book,
});

const createPendingOrder = async (userId: string, bookId: string) =>
  prisma.$transaction(
    async (transaction) => {
      const book = await transaction.book.findUnique({
        where: { id: bookId },
        select: { price: true },
      });

      if (!book) {
        throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found');
      }

      const existingOrder = await transaction.order.findFirst({
        where: {
          userId,
          bookId,
          status: { in: [OrderStatus.PENDING, OrderStatus.PAID] },
        },
        orderBy: { createdAt: 'desc' },
        select: orderSelect,
      });

      if (existingOrder?.status === OrderStatus.PAID) {
        throw new AppError(409, 'ALREADY_PURCHASED', 'Book has already been purchased');
      }

      if (existingOrder?.status === OrderStatus.PENDING) {
        return existingOrder;
      }

      return transaction.order.create({
        data: {
          userId,
          bookId,
          amount: book.price,
          status: OrderStatus.PENDING,
        },
        select: orderSelect,
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

export const createOrder = async (userId: string, bookId: string) => {
  try {
    return toOrderResponse(await createPendingOrder(userId, bookId));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return toOrderResponse(await createPendingOrder(userId, bookId));
    }

    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: orderSelect,
  });

  return orders.map(toOrderResponse);
};

export const getUserOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: orderSelect,
  });

  return order ? toOrderResponse(order) : null;
};