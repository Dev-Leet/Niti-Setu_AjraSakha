import { Response, NextFunction } from 'express';
import { FarmerProfile, Scheme, EligibilityCheck } from '@models/index.js';
import { AuthRequest } from '@middleware/index.js';
import { AppError } from '@utils/index.js';
import { eligibilityEngine } from '@services/rag/eligibilityEngine.service.js';
import { cacheKeys } from '@utils/cacheKey.utils.js';
import { redis } from '@config/redis.js';


export const eligibilityController = {
  async checkEligibility(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { profileId } = req.body;
      const startTime = Date.now();

      const cached = await redis.get(cacheKeys.eligibilityCheck(profileId));
      if (cached) {
        res.json({ 
          success: true,
          data: JSON.parse(cached),
        });
        return; 
      }

      const profile = await FarmerProfile.findOne({
        _id: profileId,
        userId: req.userId,
      });

      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      const schemes = await Scheme.find({ status: 'active' });

      const { results, totalEligible, totalBenefits } = await eligibilityEngine.checkEligibility(
        profile,
        schemes
      );

      const processingTime = Date.now() - startTime;

      const check = await EligibilityCheck.create({
        userId: req.userId,
        profileId: profile._id,
        results,
        totalEligible,
        totalBenefits,
        processingTime,
        cacheHit: false,
      });

      await redis.setex(cacheKeys.eligibilityCheck(profileId), 3600, JSON.stringify(check));

      res.json({
        success: true,
        data: check,
      });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const checks = await EligibilityCheck.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset));

      const total = await EligibilityCheck.countDocuments({ userId: req.userId });

      res.json({
        success: true,
        data: checks,
        total,
        limit: Number(limit),
        offset: Number(offset),
      });
    } catch (error) {
      next(error);
    }
  },

  async getCheckById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const check = await EligibilityCheck.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

      if (!check) {
        throw new AppError('Check not found', 404);
      }

      res.json({
        success: true,
        data: check,
      });
    } catch (error) {
      next(error);
    }
  },
};