import { Request, Response, NextFunction } from 'express';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { logger } from '@utils/logger.js';

let lastHealthCheck = 0;
let isHealthy = false;
const HEALTH_CHECK_INTERVAL = 60000;

export const ensureMLServicesHealthy = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = Date.now();
    
    if (now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
      isHealthy = await embeddingsService.healthCheck();
      lastHealthCheck = now;
      
      if (!isHealthy) {
        logger.error('ML services health check failed');
      }
    }
    
    if (!isHealthy) {
      return next(new Error('ML services unavailable'));
    }
    
    next();
  } catch (error) {
    logger.error('ML health check error:', error);
    next(error);
  }
};