/* import pdfParse from 'pdf-parse';
import { vectorStore } from './vectorStore.service.js';
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
}; */

import { vectorStoreService } from './vectorStore.service.js';

const pdfParse = require('pdf-parse');

export async function processPDF(pdfBuffer: Buffer, schemeId: string) {
  const data = await pdfParse(pdfBuffer);
  
  const pages = data.text.split('\f').map((pageText: string, index: number) => ({
    text: pageText.trim(),
    page: index + 1,
  }));

  return pages;
}