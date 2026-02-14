import cron from 'node-cron';
import { logger } from '@utils/logger.js';

export const startSchemeScraper = (): void => {
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting scheme scraper job');
    // Implement scheme scraping logic
  });
}; 