import { Router } from 'express';
import { listBooks, showBook } from '../controllers/bookController';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(listBooks));
router.get('/:id', asyncHandler(showBook));

export default router;
