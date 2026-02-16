import { pdfScraperService } from '@services/external/pdf-scraper.service.js';
import { pdfIngestionService } from '@services/pdf/ingestion.service.js';
import { Scheme } from '@models/Scheme.model.js';
import { logger } from '@utils/logger.js';

export const autoDownloaderService = {
  async downloadAndIngestScheme(schemeId: string, pdfUrl: string, schemeName: string): Promise<void> {
    try {
      logger.info(`Downloading scheme PDF: ${schemeName}`);
      const pdfBuffer = await pdfScraperService.downloadPDF(pdfUrl);

      logger.info(`Ingesting scheme: ${schemeName}`);
      await pdfIngestionService.ingestSchemePDF(schemeId, schemeName, pdfBuffer, true);

      await Scheme.findByIdAndUpdate(schemeId, {
        $set: {
          pdfUrl,
          lastUpdated: new Date(),
          status: 'active',
        },
      });

      logger.info(`Scheme ingested successfully: ${schemeName}`);
    } catch (error: any) {
      logger.error(`Scheme ingestion failed for ${schemeName}:`, error.message);
      throw error;
    }
  },

  async autoDiscoverAndIngestSchemes(): Promise<number> {
    try {
      const scrapedPDFs = await pdfScraperService.scrapeAllPortals();
      let ingestedCount = 0;

      for (const pdf of scrapedPDFs) {
        const schemeId = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
          await this.downloadAndIngestScheme(schemeId, pdf.url, pdf.title);
          ingestedCount++;
        } catch (error) {
          logger.warn(`Skipping PDF: ${pdf.title}`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      return ingestedCount;
    } catch (error: any) {
      logger.error('Auto-discovery error:', error.message);
      return 0;
    }
  },
};