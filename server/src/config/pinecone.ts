import { Pinecone } from '@pinecone-database/pinecone';
import { env } from './env.js';
import { logger } from '@utils/logger.js';

export const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
});

// export const pineconeIndex = pinecone.index(env.PINECONE_INDEX);
export const pineconeIndex = pinecone.index({
  name: env.PINECONE_INDEX
});

export const initializePinecone = async (): Promise<void> => {
  try {
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some((idx) => idx.name === env.PINECONE_INDEX);
 
    if (!indexExists) {
      await pinecone.createIndex({
        name: env.PINECONE_INDEX,
        dimension: 1536,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      });
      logger.info(`Pinecone index created: ${env.PINECONE_INDEX}`);
    } else {
      logger.info(`Pinecone index exists: ${env.PINECONE_INDEX}`);
    }
  } catch (error) {
    logger.error('Pinecone initialization failed:', error);
    throw error;
  }
};