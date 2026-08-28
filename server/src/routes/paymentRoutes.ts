import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authMiddleware';
import { createOrder, verify } from '../controllers/paymentController';

const router = Router();

router.use(authenticate);
router.post('/create-order', asyncHandler(createOrder));
router.post('/verify', asyncHandler(verify));

export default router;