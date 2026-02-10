import { FarmerProfile } from '@models/FarmerProfile.js';
import { AppError } from '@utils/AppError.js';
import { cacheService } from './cache.service.js';
import type { CreateProfileDTO } from '@/types/models/FarmerProfile.types.js';

export const profileService = {
  async create(userId: string, profileData: CreateProfileDTO) {
    const existing = await FarmerProfile.findOne({ userId });
    if (existing) {
      throw new AppError('Profile already exists', 400, 'PROFILE_EXISTS');
    }

    const profile = await FarmerProfile.create({ userId, ...profileData });
    await cacheService.deleteProfile(userId);
    return profile;
  },

  async getByUserId(userId: string) {
    const cached = await cacheService.getProfile(userId);
    if (cached) return cached;

    const profile = await FarmerProfile.findOne({ userId });
    if (!profile) {
      throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    await cacheService.setProfile(userId, profile);
    return profile;
  },

  async update(userId: string, updates: Partial<CreateProfileDTO>) {
    const profile = await FarmerProfile.findOneAndUpdate(
      { userId },
      { ...updates, $inc: { version: 1 } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    await cacheService.deleteProfile(userId);
    return profile;
  },

  async delete(userId: string) {
    const profile = await FarmerProfile.findOneAndDelete({ userId });
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    await cacheService.deleteProfile(userId);
    return profile;
  },
};