import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { getJwtSecret, JWT_EXPIRES_IN } from '../config';
import { AppError } from '../middlewares/errorHandler';

const SALT_ROUNDS = 12;

type AuthInput = {
  email: string;
  password: string;
};

const userSelect = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

const toPublicUser = (user: {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}) => user;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const signToken = (userId: string): string => {
  return jwt.sign({}, getJwtSecret(), {
    subject: userId,
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const registerUser = async ({ email, password }: AuthInput) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
    },
    select: userSelect,
  });

  return toPublicUser(user);
};

export const loginUser = async ({ email, password }: AuthInput) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = signToken(user.id);
  const { passwordHash: _passwordHash, ...publicUser } = user;

  return {
    token,
    user: toPublicUser(publicUser),
  };
};

export const getAuthenticatedUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token');
  }

  return toPublicUser(user);
};
