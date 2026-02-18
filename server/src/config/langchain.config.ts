import { env } from './env.js';

export const langchainConfig = {
  llamaServiceUrl: env.LLAMA_SERVICE_URL || 'http://localhost:5002',
  maxTokens: 200,
  temperature: 0.1,
  timeout: 15000,
  retryAttempts: 2,
  retryDelay: 1000,
  vectorSearchLimit: 3,
  vectorSearchCandidates: 100,
};