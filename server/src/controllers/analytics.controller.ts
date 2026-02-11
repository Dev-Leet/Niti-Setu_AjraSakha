import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/auth.js';
import { analyticsService } from '@services/analytics.service.js';

export const analyticsController = {
  async getUserStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsService.getUserStats(req.userId!);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSystemStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsService.getSystemStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  async trackEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventType, metadata } = req.body;
      await analyticsService.trackEvent(eventType, req.userId!, metadata);

      res.json({
        success: true,
        data: { message: 'Event tracked' },
      });
    } catch (error) {
      next(error);
    }
  },
};