import type { Job } from 'bull';
import { createRequire } from 'module';
import { embeddingService } from '@services/rag/embedding.service.js';
import { vectorSearchService } from '@services/rag/vectorSearch.service.js';
import { logger } from '@utils/index.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

interface PdfProcessorJobData {
  pdfBuffer: Buffer;
  schemeId: string;
}

export const pdfProcessor = async (job: Job<PdfProcessorJobData>) => {
  const { pdfBuffer, schemeId } = job.data;

  try {
    const data = await pdfParse(pdfBuffer);
    const pages = data.text.split('\f').map((p: string, i: number) => ({
      text: p.trim(),
      page: i + 1,
    }));

    const embeddings = await embeddingService.embedDocuments(pages.map((p: any) => p.text));
    
    const vectors = embeddings.map((embedding, idx) => ({
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