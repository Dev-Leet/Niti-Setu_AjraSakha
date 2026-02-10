import pdfParse from 'pdf-parse';
import { vectorStore } from './vectorStore.js';
import { logger } from '@config/logger.js';

export const pdfProcessor = {
  async processPDF(pdfBuffer: Buffer, schemeId: string, fileName: string): Promise<void> {
    const data = await pdfParse(pdfBuffer);
    const text = data.text;
    const pages = text.split('\f');

    const documents = pages.map((pageText, index) => ({
      id: `${schemeId}-page-${index + 1}`,
      text: pageText.trim(),
      metadata: {
        schemeId,
        fileName,
        page: index + 1,
        totalPages: pages.length,
      },
    }));

    await vectorStore.upsertDocuments(documents);
    logger.info(`Processed PDF: ${fileName} (${pages.length} pages)`);
  },
};