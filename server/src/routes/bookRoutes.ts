import { Router } from 'express';
import { downloadBook, listBooks, showBook } from '../controllers/bookController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', asyncHandler(listBooks));
router.get('/:id/download', authenticate, asyncHandler(downloadBook));
router.get('/:id', asyncHandler(showBook));

export default router;
