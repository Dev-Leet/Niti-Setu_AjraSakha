import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { redisClient } from '@config/redis.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { llamaService } from '@services/ml/llama.service.js';
import { checkLlamaServiceHealth } from '@services/langchain/health.js';

const router = Router();

/* router.get('/', async (_req, res: Response): Promise<void> => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      mongodb: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
      redis: redisClient.isOpen ? 'healthy' : 'unhealthy',
      embedding: 'unknown',
      llama: 'unknown',
    },
  };

  try {
    await embeddingsService.healthCheck();
    health.services.embedding = 'healthy';
  } catch {
    health.services.embedding = 'unhealthy';
  }

  try {
    await llamaService.generate('test', 10);
    health.services.llama = 'healthy';
  } catch {
    health.services.llama = 'unhealthy';
  }

  const allHealthy = Object.values(health.services).every(s => s === 'healthy');
  health.status = allHealthy ? 'ok' : 'degraded';

  res.status(allHealthy ? 200 : 503).json(health);
}); */

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

router.get('/mongodb', async (_req, res: Response): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      res.status(503).json({ status: 'unhealthy', error: 'Database not connected' });
      return;
    }
    await db.admin().ping();
    res.json({ status: 'healthy', readyState: mongoose.connection.readyState });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

router.get('/redis', async (_req, res: Response): Promise<void> => {
  try {
    await redisClient.ping();
    res.json({ status: 'healthy' });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

router.get('/ml', async (_req, res: Response): Promise<void> => {
  const mlHealth = {
    embedding: 'unknown',
    llama: 'unknown',
  };

  try {
    await embeddingsService.healthCheck();
    mlHealth.embedding = 'healthy';
  } catch (error: unknown) {
    const err = error as Error;
    mlHealth.embedding = `unhealthy: ${err.message}`;
  }

  try {
    await llamaService.generate('health check', 5);
    mlHealth.llama = 'healthy';
  } catch (error: unknown) {
    const err = error as Error;
    mlHealth.llama = `unhealthy: ${err.message}`;
  }

  const allHealthy = Object.values(mlHealth).every(s => s === 'healthy');
  res.status(allHealthy ? 200 : 503).json(mlHealth);
});

export default router;