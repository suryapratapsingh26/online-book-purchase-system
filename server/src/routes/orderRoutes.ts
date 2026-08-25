import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authMiddleware';
import { create, list, show } from '../controllers/orderController';

const router = Router();

router.use(authenticate);
router.post('/', asyncHandler(create));
router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(show));

export default router;