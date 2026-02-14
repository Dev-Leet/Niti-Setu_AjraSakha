import pdfParse from 'pdf-parse';
import { PDFDocument as PDFDocumentModel } from '@models/PDFDocument.model.js';
import { embeddingService } from './embedding.service.js';
import { vectorSearchService } from './vectorSearch.service.js';
import { logger } from '@utils/logger.js';
import type { PDFPage } from './types.js';

export const pdfIngestionService = {
  async processPDF(pdfId: string, pdfBuffer: Buffer, schemeId: string): Promise<void> {
    try {
      await PDFDocumentModel.findByIdAndUpdate(pdfId, { status: 'processing' });

      const data = await pdfParse(pdfBuffer);
      const pages = this.splitIntoPages(data.text);

      const embeddings = await embeddingService.embedDocuments(
        pages.map((p) => p.text)
      );
 
      await vectorSearchService.upsertVectors(
        embeddings.map((embedding, idx) => ({
          id: `${schemeId}-page-${pages[idx].pageNumber}`,
          values: embedding,
          metadata: {
            schemeId,
            page: pages[idx].pageNumber,
            text: pages[idx].text,
            pdfId,
          },
        }))
      );

      await PDFDocumentModel.findByIdAndUpdate(pdfId, {
        status: 'completed',
        processedAt: new Date(),
        totalPages: pages.length,
      });

      logger.info(`PDF processed successfully: ${pdfId}`);
    } catch (error) {
      await PDFDocumentModel.findByIdAndUpdate(pdfId, {
        status: 'failed',
        errorMessage: (error as Error).message,
      });
      logger.error(`PDF processing failed: ${pdfId}`, error);
      throw error;
    }
  },

  splitIntoPages(text: string): PDFPage[] {
    const pages = text.split('\f');
    return pages.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText.trim(),
      metadata: {},
    }));
  },
};