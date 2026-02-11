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

/*second
import type { Job } from 'bull';
import { pdfIngestionService } from '@services/rag/pdfIngestion.service.js';
import { s3Adapter } from '@adapters/storage/s3.adapter.js';
import { logger } from '@utils/logger.js';

interface PDFJobData {
  pdfId: string;
  fileUrl: string;
  schemeId: string;
}

export const pdfProcessorJob = async (job: Job<PDFJobData>): Promise<void> => {
  const { pdfId, fileUrl, schemeId } = job.data;

  logger.info(`Processing PDF: ${pdfId}`);

  const buffer = await s3Adapter.downloadFile(fileUrl);
  await pdfIngestionService.processPDF(pdfId, buffer, schemeId);

  logger.info(`PDF processed: ${pdfId}`);
};*/