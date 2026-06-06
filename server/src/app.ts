import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';
import { SERVER_CONFIG } from './config/server';

// Route imports
import authRoutes        from './modules/auth/auth.routes';
import bookRoutes        from './modules/book/book.routes';
import memberRoutes      from './modules/user/user.routes';
import transactionRoutes from './modules/transaction/transaction.routes';

const app: Application = express();

// Core middleware
app.use(cors({ origin: SERVER_CONFIG.ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'LMS API is running' });
});

// Feature routes
app.use('/api/auth',         authRoutes);
app.use('/api/books',        bookRoutes);
app.use('/api/members',      memberRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 + global error handler (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
