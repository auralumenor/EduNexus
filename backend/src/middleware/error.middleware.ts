import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (ENV.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode}: ${message}\n${err.stack}`);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
};
