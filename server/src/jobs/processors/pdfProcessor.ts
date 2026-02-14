import { embeddingService } from '@services/rag/embedding.service.js';
import { vectorSearchService } from '@services/rag/vectorSearch.service.js';
import { logger } from '@utils/index.js';

const pdfParse = require('pdf-parse');

export const pdfProcessor = async (job: { data: { pdfBuffer: Buffer; schemeId: string } }) => {
  const { pdfBuffer, schemeId } = job.data;

  try {
    const data = await pdfParse(pdfBuffer);
    const pages = data.text.split('\f').map((p: string, i: number) => ({
      text: p.trim(),
      page: i + 1,
    }));

    const embeddings: number[][] = await embeddingService.embedDocuments(pages.map((p: any) => p.text));
    
    const vectors = embeddings.map((embedding: number[], idx: number) => ({
      id: `${schemeId}_page_${idx + 1}`,
      values: embedding,
      metadata: {
        schemeId,
        page: pages[idx].page,
        text: pages[idx].text,
      },
    }));

    await vectorSearchService.upsertVectors(vectors);
    logger.info(`Processed PDF for scheme ${schemeId}`);
  } catch (error) {
    logger.error('PDF processing failed:', error);
    throw error;
  }
};