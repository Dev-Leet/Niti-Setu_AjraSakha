import { connectDatabase } from '@config/database.js';
import { seedSchemes } from './schemes.seeder.js';
import { logger } from '@utils/logger.js';

const runSeeders = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedSchemes();
    logger.info('All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeders();