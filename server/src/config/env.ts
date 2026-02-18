import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  GEMINI_API_KEY: z.string(),
  PINECONE_API_KEY: z.string(),
  PINECONE_INDEX: z.string(),
  STORAGE_TYPE: z.enum(['local', 's3']).default('local'),
  LOCAL_UPLOAD_DIR: z.string().default('./uploads'),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  LLAMA_SERVICE_URL: z.string().url().default('http://localhost:5002'),
  EMBEDDING_SERVICE_URL: z.string().url().default('http://localhost:5001'),

  LANGCHAIN_VERBOSE: z.string().default('false'),
  LANGCHAIN_CALLBACKS_BACKGROUND: z.string().default('false'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

//const parsed = envSchema.safeParse(process.env);

/* if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
} */

//export const env = parsed.data;

/* export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-schemes'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRY || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
    index: process.env.PINECONE_INDEX || 'agricultural-schemes'
  }
}; */
