import pdfParse from 'pdf-parse';
import { embeddingService } from './embedding.service.js';
import { vectorSearchService } from './vectorSearch.service.js';
import { logger } from '@utils/logger.js';


export const pdfProcessor = async (job: { data: { pdfBuffer: Buffer; schemeId: string } }) => {
  const { pdfBuffer, schemeId } = job.data;

  try {
    const data = await pdfParse(pdfBuffer);
    const pages = data.text.split('\f').map((pageText: string, index: number) => ({
      text: pageText.trim(),
      page: index + 1,
    }));

    const embeddings = await embeddingService.embedDocuments(pages.map((p: { text: string }) => p.text));
    await vectorSearchService.upsertVectors(
      embeddings.map((embedding, idx) => ({
        id: `${schemeId}-page-${pages[idx].page}`,
        values: embedding,
        metadata: {
          schemeId,
          page: pages[idx].page,
          text: pages[idx].text,
        },
      }))
    );

    logger.info(`PDF processed for scheme: ${schemeId}`);
  } catch (error) {
    logger.error('PDF processing failed:', error);
    throw error;
  }
};