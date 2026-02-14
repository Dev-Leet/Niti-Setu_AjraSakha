/* import { pineconeIndex } from '@config/pinecone.js';

export const vectorStoreService = {
  async upsertVectors(vectors: Array<{ id: string; values: number[]; metadata: any }>) {
    await pineconeIndex.namespace('').upsert(vectors);
  },

  async searchVectors(queryVector: number[], topK = 5, filter?: Record<string, any>) {
    const results = await pineconeIndex.namespace('').query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter,
    });
    return results.matches || [];
  }, 

  async deleteBySchemeId(schemeId: string) {
    await pineconeIndex.namespace('').deleteMany({ filter: { schemeId } });
  },
}; */

import { pineconeIndex } from '@config/pinecone.js';

export const vectorStoreService = {
  async upsertVectors(vectors: Array<{ id: string; values: number[]; metadata: any }>) {
    if (vectors.length === 0) return;
    await pineconeIndex.namespace('').upsert({ records: vectors });
  },

  async searchVectors(queryVector: number[], topK = 5, filter?: Record<string, any>) {
    const results = await pineconeIndex.namespace('').query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter,
    });
    return results.matches || [];
  },

  async deleteBySchemeId(schemeId: string) {
    await pineconeIndex.namespace('').deleteMany({ filter: { schemeId } });
  },
};