import axios from 'axios';
import { logger } from '@utils/logger.js';
import { pdfIngestionService } from '@services/pdf/ingestion.service.js';

interface SchemeSource {
  schemeId: string;
  schemeName: string;
  pdfUrl: string;
  ministry: string;
}

const SCHEME_SOURCES: SchemeSource[] = [
  {
    schemeId: 'pm-kisan',
    schemeName: 'PM-KISAN Pradhan Mantri Kisan Samman Nidhi',
    pdfUrl: 'https://pmkisan.gov.in/Documents/Pradhan_Mantri_Kisan_Samman_Nidhi.pdf',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
  },
  {
    schemeId: 'pm-kusum',
    schemeName: 'PM-KUSUM Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan',
    pdfUrl: 'https://mnre.gov.in/img/documents/PM-KUSUM-Guideline.pdf',
    ministry: 'Ministry of New and Renewable Energy',
  },
  {
    schemeId: 'agri-infra-fund',
    schemeName: 'Agriculture Infrastructure Fund',
    pdfUrl: 'https://agriinfra.dac.gov.in/Content/PDF/AIF_Operational_Guidelines.pdf',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
  },
];

export const schemeDownloaderService = {
  async downloadPDF(url: string): Promise<Buffer> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000,
      maxContentLength: 100 * 1024 * 1024,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NitiSetu/1.0)',
        'Accept': 'application/pdf',
      },
    });
    return Buffer.from(response.data);
  },

  async downloadAndIngestAll(): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const scheme of SCHEME_SOURCES) {
      try {
        logger.info(`Downloading: ${scheme.schemeName}`);
        const pdfBuffer = await this.downloadPDF(scheme.pdfUrl);
        await pdfIngestionService.ingestSchemePDF(scheme.schemeId, scheme.schemeName, pdfBuffer, true);
        success.push(scheme.schemeId);
        logger.info(`Ingested: ${scheme.schemeName}`);
      } catch (error: unknown) {
        const err = error as Error;
        logger.error(`Failed to ingest ${scheme.schemeName}: ${err.message}`);
        failed.push(scheme.schemeId);
      }
    }

    return { success, failed };
  },

  async downloadAndIngestOne(schemeId: string): Promise<void> {
    const scheme = SCHEME_SOURCES.find(s => s.schemeId === schemeId);
    if (!scheme) throw new Error(`Scheme not found: ${schemeId}`);

    const pdfBuffer = await this.downloadPDF(scheme.pdfUrl);
    await pdfIngestionService.ingestSchemePDF(scheme.schemeId, scheme.schemeName, pdfBuffer, true);
  },

  getSchemeList(): SchemeSource[] {
    return SCHEME_SOURCES;
  },
};
