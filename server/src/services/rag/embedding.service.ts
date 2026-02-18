import { OpenAIEmbeddings } from '@langchain/openai';
import { env } from '@config/env.js';
 
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: env.OPENAI_API_KEY,
  modelName: 'text-embedding-3-small',
});

export const embeddingService = {
  async embedQuery(text: string): Promise<number[]> {
    return embeddings.embedQuery(text);
  },

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return embeddings.embedDocuments(texts);
  },
}; 