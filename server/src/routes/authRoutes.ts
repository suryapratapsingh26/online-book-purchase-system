import { Router } from 'express';
import { login, me, register } from '../controllers/authController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', authenticate, asyncHandler(me));

export default router;
