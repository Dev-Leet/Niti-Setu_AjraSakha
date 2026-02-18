import axios from 'axios';
import { env } from '@config/env.js';

export async function checkLlamaServiceHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${env.LLAMA_SERVICE_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}