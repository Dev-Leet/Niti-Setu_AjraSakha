import cron from 'node-cron';
import { logger } from '@utils/logger.js';

export const startAnalyticsAggregator = (): void => {
  cron.schedule('0 0 * * *', async () => {
    logger.info('Starting analytics aggregation job');
    // Implement analytics aggregation logic
  });
}; 