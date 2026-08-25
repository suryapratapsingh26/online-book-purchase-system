import type { Request, Response } from 'express';
import {
  getAuthenticatedUser,
  loginUser,
  registerUser,
} from '../services/authService';
import { AppError } from '../middlewares/errorHandler';

type AuthBody = {
  email?: unknown;
  password?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const validateAuthBody = (body: AuthBody) => {
  const { email, password } = body;
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';

  if (!emailPattern.test(normalizedEmail)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'A valid email is required');
  }

  if (typeof password !== 'string' || password.trim().length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  }

  return {
    email: normalizedEmail,
    password,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const input = validateAuthBody(req.body as AuthBody);
  const user = await registerUser(input);

  res.status(201).json({ data: { user } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const input = validateAuthBody(req.body as AuthBody);
  const result = await loginUser(input);

  res.json({ data: result });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.auth?.userId) {
    throw new AppError(401, 'MISSING_TOKEN', 'Authentication token is required');
  }

  const user = await getAuthenticatedUser(req.auth.userId);

  res.json({ data: { user } });
};
