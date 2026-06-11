import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  kind?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose CastError — invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values((err as any).errors)
      .map((e: any) => e.message)
      .join(', ');
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field';
    message = `Duplicate value for ${field}`;
  }

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
