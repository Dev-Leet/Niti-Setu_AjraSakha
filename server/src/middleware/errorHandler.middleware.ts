import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError.js';
import { logger } from '@config/logger.js';
 
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: _req.path,
    method: _req.method,
  }); 

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};