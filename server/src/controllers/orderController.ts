import type { Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler';
import {
  createOrder,
  getUserOrder,
  getUserOrders,
} from '../services/orderService';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getAuthenticatedUserId = (req: Request) => {
  if (!req.auth?.userId) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication is required');
  }

  return req.auth.userId;
};

const validateUuid = (value: unknown, code: string, message: string): string => {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(400, code, message);
  }

  return value;
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = getAuthenticatedUserId(req);
  const body = req.body as { bookId?: unknown };
  const bookId = validateUuid(
    body?.bookId,
    'INVALID_BOOK_ID',
    'Book ID must be a valid UUID'
  );

  const order = await createOrder(userId, bookId);
  res.status(201).json({ data: order });
};

export const list = async (req: Request, res: Response): Promise<void> => {
  const orders = await getUserOrders(getAuthenticatedUserId(req));
  res.json({ data: orders });
};

export const show = async (req: Request, res: Response): Promise<void> => {
  const orderId = validateUuid(
    req.params.id,
    'INVALID_ORDER_ID',
    'Order ID must be a valid UUID'
  );
  const order = await getUserOrder(getAuthenticatedUserId(req), orderId);

  if (!order) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  }

  res.json({ data: order });
};