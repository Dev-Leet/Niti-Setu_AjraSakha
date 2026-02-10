import { Request, Response, NextFunction } from 'express';
import { Scheme } from '@models/Scheme.js';
import { SavedScheme } from '@models/SavedScheme.js';
import { AuthRequest } from '@middleware/auth.js';
import { AppError } from '@utils/AppError.js';
import { redis } from '@config/redis.js';
import { cacheKeys } from '@utils/cacheKey.js';

export const schemeController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { state, ministry, category } = req.query;
      const filters: any = { status: 'active' };

      if (state) filters['eligibilityRules.allowedStates'] = state;
      if (ministry) filters.ministry = ministry;
      if (category) filters.category = category;

      const cacheKey = cacheKeys.schemes(JSON.stringify(filters));
      const cached = await redis.get(cacheKey);

      if (cached) {
        res.json({
          success: true,
          data: JSON.parse(cached),
        });
        return;
      }

      const schemes = await Scheme.find(filters).select('-pdfDocuments');

      await redis.setex(cacheKey, 3600, JSON.stringify(schemes));

      res.json({
        success: true,
        data: schemes,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cached = await redis.get(cacheKeys.scheme(req.params.id));
      if (cached) {
        res.json({
          success: true,
          data: JSON.parse(cached),
        });
        return;
      }

      const scheme = await Scheme.findOne({ schemeId: req.params.id });
      if (!scheme) {
        throw new AppError('Scheme not found', 404);
      }

      await redis.setex(cacheKeys.scheme(req.params.id), 3600, JSON.stringify(scheme));

      res.json({
        success: true,
        data: scheme,
      });
    } catch (error) {
      next(error);
    }
  },

  async save(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schemeId, notes } = req.body;

      const scheme = await Scheme.findOne({ schemeId });
      if (!scheme) {
        throw new AppError('Scheme not found', 404);
      }

      const saved = await SavedScheme.findOneAndUpdate(
        { userId: req.userId, schemeId },
        { notes, userId: req.userId, schemeId },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        data: saved,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSaved(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const saved = await SavedScheme.find({ userId: req.userId });
      const schemeIds = saved.map((s) => s.schemeId);

      const schemes = await Scheme.find({ schemeId: { $in: schemeIds } }).select('-pdfDocuments');

      res.json({
        success: true,
        data: schemes,
      });
    } catch (error) {
      next(error);
    }
  },
};