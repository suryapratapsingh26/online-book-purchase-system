import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 4000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const JWT_EXPIRES_IN = '1h';

export const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwtSecret;
};

export const getRazorpayKeyId = (): string => {
  const keyId = process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    throw new Error('RAZORPAY_KEY_ID is not configured');
  }

  return keyId;
};

export const getRazorpayKeySecret = (): string => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured');
  }

  return keySecret;
};
