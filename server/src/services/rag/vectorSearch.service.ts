import { pineconeIndex } from '@config/pinecone.js';

import type { EmbeddingVector, SearchResult } from './types.js';


export const vectorSearchService = {
  async upsertVectors(vectors: EmbeddingVector[]): Promise<void> {
    await pineconeIndex.namespace('').upsert({ records: vectors });
  },

  async search(queryVector: number[], topK = 5, filter?: Record<string, any>): Promise<SearchResult[]> {
    const results = await pineconeIndex.namespace('').query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter,
    }); 

    return results.matches?.map((match) => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata as any,
    })) || [];
  },

  async deleteBySchemeId(schemeId: string): Promise<void> {
    await pineconeIndex.namespace('').deleteMany({ filter: { schemeId } });
  },
};

/* import { pineconeIndex } from '@config/pinecone.js';
import type { EmbeddingVector, SearchResult } from './types.js';

export const vectorSearchService = {
  async upsertVectors(vectors: EmbeddingVector[]): Promise<void> {
    if (vectors.length === 0) return;
    await pineconeIndex.namespace('').upsert(vectors);
  },

  async search(queryVector: number[], topK = 5, filter?: Record<string, any>): Promise<SearchResult[]> {
    const results = await pineconeIndex.namespace('').query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter,
    });

    return results.matches?.map((match) => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata as any,
    })) || [];
  },

  async deleteBySchemeId(schemeId: string): Promise<void> {
    await pineconeIndex.namespace('').deleteMany({ filter: { schemeId } });
  },
}; */