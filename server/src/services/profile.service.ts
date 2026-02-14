import { FarmerProfile } from '@models/index.js';
import { AppError } from '@utils/index.js';
import { cacheService } from './cache.service.js';

interface CreateProfileDTO {
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: {
    totalArea: number;
    ownershipType: string;
    irrigationType?: string;
  }; 
  cropTypes: string[];
  socialCategory: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  aadharNumber?: string;
}

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