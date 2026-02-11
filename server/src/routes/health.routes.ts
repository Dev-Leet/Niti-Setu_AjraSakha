import { Router } from 'express';
import mongoose from 'mongoose';
import { redis } from '@config/redis.js';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redis.status === 'ready' ? 'connected' : 'disconnected',
  };
  
  const status = health.mongodb === 'connected' && health.redis === 'connected' ? 200 : 503;
  res.status(status).json(health);
});

export default router;