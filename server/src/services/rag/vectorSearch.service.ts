import { pineconeIndex } from '@config/pinecone.js';
import type { EmbeddingVector, SearchResult } from './types.js';

export const vectorSearchService = {
  async upsertVectors(vectors: EmbeddingVector[]): Promise<void> {
    await pineconeIndex.upsert(vectors);
  },

  async search(queryVector: number[], topK = 5, filter?: Record<string, any>): Promise<SearchResult[]> {
    const results = await pineconeIndex.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter,
    });

    return results.matches?.map((match) => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata || {},
    })) || [];
  },

  async deleteBySchemeId(schemeId: string): Promise<void> {
    await pineconeIndex.deleteMany({ schemeId });
  },
};