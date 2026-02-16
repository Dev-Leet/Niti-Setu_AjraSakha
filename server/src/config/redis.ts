import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from '@utils/logger.js';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis connected'));

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
};