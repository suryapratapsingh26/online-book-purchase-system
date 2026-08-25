import type { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { getJwtSecret } from '../config';
import { AppError } from './errorHandler';

const JWT_SECRET = getJwtSecret();

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization')?.trim();

  if (!authHeader) {
    return next(
      new AppError(401, 'MISSING_TOKEN', 'Authentication token is required')
    );
  }

  const [scheme, token] = authHeader.split(/\s+/);

  if (scheme !== 'Bearer' || !token || token.includes(' ')) {
    return next(
      new AppError(
        401,
        'MALFORMED_TOKEN',
        'Authorization header must be a Bearer token'
      )
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    if (typeof payload.sub !== 'string') {
      return next(new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token'));
    }

    req.auth = {
      userId: payload.sub,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new AppError(401, 'TOKEN_EXPIRED', 'Invalid or expired token'));
    }

    return next(new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token'));
  }
};
