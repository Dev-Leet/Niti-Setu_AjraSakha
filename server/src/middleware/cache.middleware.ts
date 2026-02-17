import { Request, Response, NextFunction } from 'express';

export const cacheMiddleware = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${duration}`);
    }
    next();
  };
};

export const noCacheMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};