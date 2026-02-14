import type { Job } from 'bull';
import { embeddingService } from '@services/rag/embedding.service.js';
import { vectorSearchService } from '@services/rag/vectorSearch.service.js';
import { logger } from '@utils/logger.js';

interface EmbeddingJobData {
  texts: string[];
  schemeId: string;
} 

export const embeddingGeneratorJob = async (job: Job<EmbeddingJobData>): Promise<void> => {
  const { texts, schemeId } = job.data;

  logger.info(`Generating embeddings for scheme: ${schemeId}`);

  const embeddings = await embeddingService.embedDocuments(texts);

  await vectorSearchService.upsertVectors(
    embeddings.map((embedding, idx) => ({
      id: `${schemeId}-chunk-${idx}`,
      values: embedding,
      metadata: { schemeId, text: texts[idx] },
    }))
  );

  logger.info(`Embeddings generated for scheme: ${schemeId}`);
};