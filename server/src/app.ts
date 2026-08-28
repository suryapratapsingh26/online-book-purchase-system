import express from 'express';
import cors from 'cors';
import path from 'node:path';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.get('/uploads/covers/:file', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'uploads/covers/book-cover.svg'));
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

export default app;
