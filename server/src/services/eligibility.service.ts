import { FarmerProfile } from '@models/FarmerProfile.js';
import { Scheme } from '@models/Scheme.js';
import { EligibilityCheck } from '@models/EligibilityCheck.js';
import { AppError } from '@utils/AppError.js';
import { eligibilityEngine } from './rag/eligibilityEngine.js';
import { cacheService } from './cache.service.js';

export const eligibilityService = {
  async checkEligibility(userId: string, profileId: string) {
    const startTime = Date.now();

    const cached = await cacheService.getEligibilityCheck(profileId);
    if (cached) {
      return { ...cached, cacheHit: true };
    }

    const profile = await FarmerProfile.findOne({ _id: profileId, userId });
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
      userId,
      profileId: profile._id,
      results,
      totalEligible,
      totalBenefits,
      processingTime,
      cacheHit: false,
    });

    await cacheService.setEligibilityCheck(profileId, check);
    return check;
  },

  async getHistory(userId: string, limit = 10, offset = 0) {
    const checks = await EligibilityCheck.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await EligibilityCheck.countDocuments({ userId });

    return { checks, total, limit, offset };
  },

  async getById(userId: string, checkId: string) {
    const check = await EligibilityCheck.findOne({ _id: checkId, userId });
    if (!check) {
      throw new AppError('Check not found', 404);
    }
    return check;
  },
};