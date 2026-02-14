import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/auth.middleware.js';
import { NotificationPreferences } from '@models/NotificationPreferences.model.js';

export const preferencesController = {
  async get(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let prefs = await NotificationPreferences.findOne({ userId: req.userId });
      if (!prefs) {
        prefs = await NotificationPreferences.create({ userId: req.userId });
      }
      res.json({ success: true, data: prefs });
    } catch (error) {
      next(error);
    }
  }, 

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const prefs = await NotificationPreferences.findOneAndUpdate(
        { userId: req.userId },
        req.body,
        { new: true, upsert: true }
      );
      res.json({ success: true, data: prefs });
    } catch (error) {
      next(error);
    }
  },
};