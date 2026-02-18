import './config/env.js';
import { app } from './app.js';
import { connectDatabase } from '@config/database.js';
import { connectRedis } from '@config/redis.js';
import { logger } from '@utils/logger.js';
import { initializeJobs } from './jobs/index.js';
import { createServer } from 'http';
import { initializeWebSocket, setIO } from './websocket/index.js';


const httpServer = createServer(app);
const ioInstance = initializeWebSocket(httpServer);
setIO(ioInstance); 

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await connectRedis();
    await initializeJobs();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});