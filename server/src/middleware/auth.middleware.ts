import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/errors.js';
import { verifyAccessToken } from '@utils/jwt.utils.js';
import { logger } from '@utils/logger.js';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}



export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided', { path: req.path });
      throw new AppError('No token provided', 401, 'NO_TOKEN');
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      throw new AppError('Invalid token format', 401, 'INVALID_TOKEN_FORMAT');
    }

    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Auth middleware error', { error: err.message, path: req.path });
    next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
  }
};

export const requireRole = (...roles: string[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userRole || !roles.includes(req.userRole)) {
        throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorize = requireRole;