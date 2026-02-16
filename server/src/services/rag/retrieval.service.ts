import { SchemeChunk } from '@models/SchemeChunk.model.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { queryBuilderService } from './queryBuilder.service.js';

interface RetrievalResult {
  chunk: any;
  score: number;
}

export const retrievalService = {
  async findRelevantChunks(query: string, schemeId?: string, topK = 5): Promise<RetrievalResult[]> {
    const queryEmbedding = await embeddingsService.embedSingle(query);
    
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: 'scheme_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: schemeId ? { schemeId: { $eq: schemeId } } : {},
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $project: {
          _id: 1,
          schemeId: 1,
          schemeName: 1,
          chunkText: 1,
          sectionTitle: 1,
          pageNumber: 1,
          chunkIndex: 1,
          isEligibilitySection: 1,
          metadata: 1,
          score: 1,
        },
      },
    ];
    
    const results = await SchemeChunk.aggregate(pipeline);
    
    return results.map(r => ({
      chunk: r,
      score: r.score,
    }));
  },

  async findEligibilityChunks(schemeId: string, topK = 3): Promise<RetrievalResult[]> {
    const query = 'Eligibility criteria conditions requirements qualifications';
    const queryEmbedding = await embeddingsService.embedSingle(query);
    
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: 'scheme_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: {
            $and: [
              { schemeId: { $eq: schemeId } },
              { isEligibilitySection: { $eq: true } },
            ],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];
    
    const results = await SchemeChunk.aggregate(pipeline);
    
    return results.map(r => ({
      chunk: r,
      score: r.score,
    }));
  },
  async findWithStructuredQuery(
    profile: any,
    schemeId: string,
    topK = 5
  ): Promise<RetrievalResult[]> {
    const structuredQuery = queryBuilderService.buildEligibilityQuery(profile);
    const queryEmbedding = await embeddingsService.embedSingle(structuredQuery);
    
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: 'scheme_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: {
            $and: [
              { schemeId: { $eq: schemeId } },
              { isEligibilitySection: { $eq: true } },
            ],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $project: {
          _id: 1,
          schemeId: 1,
          schemeName: 1,
          chunkText: 1,
          sectionTitle: 1,
          pageNumber: 1,
          chunkIndex: 1,
          isEligibilitySection: 1,
          metadata: 1,
          score: 1,
        },
      },
    ];
    
    const results = await SchemeChunk.aggregate(pipeline);
    
    return results.map(r => ({
      chunk: r,
      score: r.score,
    }));
  },
};
