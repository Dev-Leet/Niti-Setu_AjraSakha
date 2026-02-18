import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { redisClient } from '@config/redis.js';
import { checkLlamaServiceHealth } from '@services/langchain/health.js';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  let redisStatus = 'disconnected';
  try {
    await redisClient.ping();
    redisStatus = 'connected';
  } catch {
    redisStatus = 'error';
  }

  const llamaStatus = await checkLlamaServiceHealth() ? 'online' : 'offline';

  const db = mongoose.connection.db;
  let vectorIndexStatus = 'unknown';
  
  if (db) {
    try {
      const indexes = await db.collection('schemechunks').listSearchIndexes().toArray();
      vectorIndexStatus = indexes.some((idx: { name: string }) => idx.name === 'scheme_vector_index') 
        ? 'configured' 
        : 'missing';
    } catch {
      vectorIndexStatus = 'unavailable';
    }
  }

  res.json({
    status: 'ok',
    services: {
      mongodb: mongoStatus,
      redis: redisStatus,
      llama: llamaStatus,
      vectorSearch: vectorIndexStatus,
    },
  });
});

export default router;