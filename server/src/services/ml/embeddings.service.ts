import axios from 'axios';

const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:5001';
const REQUEST_TIMEOUT = 30000;

export const embeddingsService = {
  async embedTexts(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    
    const chunks = this.chunkArray(texts, 100);
    const allEmbeddings: number[][] = [];
    
    for (const chunk of chunks) {
      const response = await axios.post(
        `${EMBEDDING_SERVICE_URL}/embed`,
        { texts: chunk },
        { timeout: REQUEST_TIMEOUT }
      );
      allEmbeddings.push(...response.data.embeddings);
    }
    
    return allEmbeddings;
  },

  async embedSingle(text: string): Promise<number[]> {
    const response = await axios.post(
      `${EMBEDDING_SERVICE_URL}/embed/single`,
      { text },
      { timeout: REQUEST_TIMEOUT }
    );
    return response.data.embedding;
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${EMBEDDING_SERVICE_URL}/health`, { timeout: 5000 });
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  },

  chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};