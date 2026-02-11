import './config/env.js';
import { app } from './app.js';
import { connectDatabase } from '@config/database.js';
import { connectRedis } from '@config/redis.js';
import { logger } from '@utils/index.js';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();