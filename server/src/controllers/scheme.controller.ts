import { Response, NextFunction } from 'express';
import { Scheme } from '@models/Scheme.model.js';
import { SavedScheme } from '@models/SavedScheme.model.js';
import { AuthRequest } from '@middleware/auth.middleware.js';
import { cacheKeys } from '@utils/cacheKey.utils.js';
import { redisClient } from '@config/redis.js';
 
export const schemeController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { state, ministry, category } = req.query;
      const query: any = { status: 'active' };

      if (state && typeof state === 'string') query['eligibilityRules.allowedStates'] = state;
      if (ministry && typeof ministry === 'string') query.ministry = ministry;
      if (category && typeof category === 'string') query.category = category;

      const cacheKey = cacheKeys.schemes(JSON.stringify(query));
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        res.json({ success: true, data: JSON.parse(cached) });
        return;
      }

      const schemes = await Scheme.find(query).select('-pdfDocuments');
      await redisClient.setex(cacheKey, 3600, JSON.stringify(schemes));

      res.json({ success: true, data: schemes });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const schemeId = Array.isArray(req.params.schemeId) ? req.params.schemeId[0] : req.params.schemeId;
      
      const cacheKey = cacheKeys.scheme(schemeId);
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        res.json({ success: true, data: JSON.parse(cached) });
        return;
      }

      const scheme = await Scheme.findOne({ schemeId });
      if (!scheme) {
        res.status(404).json({ success: false, error: { message: 'Scheme not found' } });
        return;
      }

      await redisClient.setex(cacheKey, 3600, JSON.stringify(scheme));
      res.json({ success: true, data: scheme });
    } catch (error) {
      next(error);
    }
  },

  async saveScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schemeId, notes } = req.body;

      const scheme = await Scheme.findOne({ schemeId });
      if (!scheme) {
        res.status(404).json({ success: false, error: { message: 'Scheme not found' } });
        return;
      }

      const saved = await SavedScheme.findOneAndUpdate(
        { userId: req.userId, schemeId },
        { notes, userId: req.userId, schemeId },
        { upsert: true, new: true }
      );

      res.json({ success: true, data: saved });
    } catch (error) {
      next(error);
    }
  },

  async getSavedSchemes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const saved = await SavedScheme.find({ userId: req.userId });
      const schemeIds = saved.map((s: any) => s.schemeId);
      const schemes = await Scheme.find({ schemeId: { $in: schemeIds } }).select('-pdfDocuments');

      res.json({ success: true, data: schemes });
    } catch (error) {
      next(error);
    }
  },
};