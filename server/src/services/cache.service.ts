import { redis } from '@config/redis.js';
import { cacheKeys } from '@utils/cacheKey.js';

const DEFAULT_TTL = 3600;

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  },

  async set(key: string, value: any, ttl = DEFAULT_TTL): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async getProfile(userId: string) {
    return this.get(cacheKeys.profile(userId));
  },

  async setProfile(userId: string, profile: any) {
    return this.set(cacheKeys.profile(userId), profile);
  },

  async deleteProfile(userId: string) {
    return this.del(cacheKeys.profile(userId));
  },

  async getEligibilityCheck(profileId: string) {
    return this.get(cacheKeys.eligibilityCheck(profileId));
  },

  async setEligibilityCheck(profileId: string, check: any) {
    return this.set(cacheKeys.eligibilityCheck(profileId), check);
  },

  async getScheme(schemeId: string) {
    return this.get(cacheKeys.scheme(schemeId));
  },

  async setScheme(schemeId: string, scheme: any) {
    return this.set(cacheKeys.scheme(schemeId), scheme);
  },

  async getSchemes(filters: string) {
    return this.get(cacheKeys.schemes(filters));
  },

  async setSchemes(filters: string, schemes: any) {
    return this.set(cacheKeys.schemes(filters), schemes);
  },
};