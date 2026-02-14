import { Response, NextFunction } from 'express';
import { FarmerProfile } from '@models/index.js';
import { AuthRequest } from '@middleware/index.js';
import { cacheKeys } from '@utils/index.js';
import { redis } from '@config/redis.js';
import { AppError } from '@utils/index.js';

export const profileController = {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await FarmerProfile.findOne({ userId: req.userId });
      if (existing) {
        throw new AppError('Profile already exists', 400, 'PROFILE_EXISTS');
      }

      const profile = await FarmerProfile.create({
        userId: req.userId,
        ...req.body,
      }); 

      await redis.del(cacheKeys.profile(req.userId!));

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async get(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cached = await redis.get(cacheKeys.profile(req.userId!));
      if (cached) {
        res.json({
          success: true,
          data: JSON.parse(cached),
        });
        return;
      }

      const profile = await FarmerProfile.findOne({ userId: req.userId });
      if (!profile) {
        throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
      }

      await redis.setex(cacheKeys.profile(req.userId!), 3600, JSON.stringify(profile));

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await FarmerProfile.findOneAndUpdate(
        { userId: req.userId },
        { ...req.body, version: { $inc: 1 } },
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      await redis.del(cacheKeys.profile(req.userId!));

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await FarmerProfile.findOneAndDelete({ userId: req.userId });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      await redis.del(cacheKeys.profile(req.userId!));

      res.json({
        success: true,
        data: { message: 'Profile deleted' },
      });
    } catch (error) {
      next(error);
    }
  },
};