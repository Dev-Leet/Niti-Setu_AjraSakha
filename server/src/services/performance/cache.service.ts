import { redisClient } from '@config/redis.js';
import { logger } from '@utils/logger.js';

const DEFAULT_TTL = 300;

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (err: unknown) {
      logger.error('Cache set error:', (err as Error).message);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (err: unknown) {
      logger.error('Cache del error:', (err as Error).message);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err: unknown) {
      logger.error('Cache delPattern error:', (err as Error).message);
    }
  },

  eligibilityKey(schemeId: string, profileHash: string): string {
    return `eligibility:${schemeId}:${profileHash}`;
  },

  dashboardKey(userId: string): string {
    return `dashboard:${userId}`;
  },

  schemesKey(): string {
    return 'schemes:all';
  },
};