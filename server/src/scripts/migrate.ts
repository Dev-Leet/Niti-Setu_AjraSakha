import { connectDatabase } from '@config/database.js';
import { logger } from '@utils/logger.js';

const runMigrations = async (): Promise<void> => {
  try {
    await connectDatabase();
    logger.info('Migrations completed');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();