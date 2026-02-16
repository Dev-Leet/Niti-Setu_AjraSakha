import mongoose from 'mongoose';
import { env } from '@config/env.js';
import { logger } from '@utils/logger.js';

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
    
    await verifyAtlasVectorSearch();
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

async function verifyAtlasVectorSearch(): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      logger.warn('MongoDB database not available yet');
      return;
    }

    const collections = await db.listCollections({ name: 'schemechunks' }).toArray();
    
    if (collections.length === 0) {
      logger.info('SchemeChunk collection does not exist yet');
      return;
    }
    
    const indexes = await db.collection('schemechunks').listSearchIndexes().toArray();
    const vectorIndex = indexes.find((idx: { name: string }) => idx.name === 'scheme_vector_index');
    
    if (vectorIndex) {
      logger.info('MongoDB Atlas Vector Search index verified');
    } else {
      logger.warn('Vector search index not found. Please create it manually in Atlas.');
      logger.warn('Index definition available in: server/atlas-setup/vector-index.json');
    }
  } catch (error: unknown) {
    const err = error as { codeName?: string; message: string };
    if (err.codeName === 'CommandNotSupported') {
      logger.warn('Vector search not available. Using MongoDB Atlas cluster?');
    } else {
      logger.error('Vector search verification error:', err.message);
    }
  }
}