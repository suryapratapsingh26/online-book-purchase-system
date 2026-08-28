import type { Request, Response } from 'express';
import { getAuthorizedDownloadPath } from '../services/downloadService';
import { getBookById, getBooks } from '../services/bookService';
import { AppError } from '../middlewares/errorHandler';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const listBooks = async (_req: Request, res: Response): Promise<void> => {
  const books = await getBooks();
  res.json({ data: books });
};

export const showBook = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (typeof id !== 'string' || !uuidPattern.test(id)) {
    throw new AppError(400, 'INVALID_BOOK_ID', 'Book ID must be a valid UUID');
  }

  const book = await getBookById(id);

  if (!book) {
    throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found');
  }

  res.json({ data: book });
};

export const downloadBook = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (typeof id !== 'string' || !uuidPattern.test(id)) {
    throw new AppError(400, 'INVALID_BOOK_ID', 'Book ID must be a valid UUID');
  }

  if (!req.auth?.userId) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication is required');
  }

  const filePath = await getAuthorizedDownloadPath(req.auth.userId, id);

  if (filePath === null) {
    throw new AppError(404, 'BOOK_NOT_PURCHASED', 'Book is not available for download');
  }

  if (filePath === undefined) {
    throw new AppError(404, 'BOOK_FILE_NOT_FOUND', 'Book file not found');
  }

  res.sendFile(filePath);
};
