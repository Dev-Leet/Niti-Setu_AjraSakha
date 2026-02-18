import { Request, Response, NextFunction } from 'express';

export const llmTimeoutMiddleware = (timeoutMs = 20000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: 'LLM processing timeout',
          fallback: true,
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timeout));
    next();
  };
};