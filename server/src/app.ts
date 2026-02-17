import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from '@middleware/index.js';
import { loggerMiddleware } from '@middleware/index.js';
import { errorHandler } from '@middleware/index.js';
import { apiLimiter } from '@middleware/index.js';
import routes from '@/routes/index.js';
import { compressionMiddleware } from '@middleware/compression.middleware.js';
import { cacheMiddleware } from '@middleware/cache.middleware.js';

export const app = express(); 

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(compressionMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiLimiter, routes);
app.use('/api/v1/schemes', cacheMiddleware(300));
app.use('/api/v1/analytics', cacheMiddleware(60));

app.use(errorHandler);




/* import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { logger } from './middleware/logger.middleware';

const app: Application = express();

// Security
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(logger);

// Routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

export default app;
 */