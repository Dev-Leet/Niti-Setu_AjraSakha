import Queue from 'bull';
import { env } from '@config/env.js';
import { pdfProcessorJob } from './processors/pdfProcessor.js';
import { embeddingGeneratorJob } from './processors/embeddingGenerator.js';
import { notificationSenderJob } from './processors/notificationSender.js';
import { logger } from '@utils/logger.js';

const pdfQueue = new Queue('pdf-processing', env.REDIS_URL);
const embeddingQueue = new Queue('embedding-generation', env.REDIS_URL);
const notificationQueue = new Queue('notification-sending', env.REDIS_URL);

export const initializeJobs = async (): Promise<void> => {
  pdfQueue.process(pdfProcessorJob);
  embeddingQueue.process(embeddingGeneratorJob);
  notificationQueue.process(notificationSenderJob);

  logger.info('Job queues initialized');
};

export const queues = {
  pdf: pdfQueue,
  embedding: embeddingQueue,
  notification: notificationQueue,
};