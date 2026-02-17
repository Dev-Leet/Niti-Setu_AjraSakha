/* import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '@utils/logger.js';

interface ScrapedPDF {
  url: string;
  title: string;
  source: string;
  scrapedAt: Date;
}

type CheerioElement = ReturnType<typeof cheerio.load> extends (selector: string) => { each: (fn: (_: number, el: infer E) => void) => void } ? E : never;

export const pdfScraperService = {
  async scrapePMKISANPortal(): Promise<ScrapedPDF[]> {
    const pdfs: ScrapedPDF[] = [];

    try {
      const response = await axios.get('https://pmkisan.gov.in/', { timeout: 10000 });
      const $ = cheerio.load(response.data);

      $('a[href$=".pdf"]').each((_index: number, element: ReturnType<typeof $>[number]) => {
        const href = $(element).attr('href');
        const title = $(element).text().trim() || 'PM-KISAN Document';

        if (href) {
          pdfs.push({
            url: href.startsWith('http') ? href : `https://pmkisan.gov.in${href}`,
            title,
            source: 'PM-KISAN',
            scrapedAt: new Date(),
          });
        }
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('PM-KISAN scraping error:', err.message);
    }

    return pdfs;
  },

  async scrapeMinistryPortal(url: string, ministryName: string): Promise<ScrapedPDF[]> {
    const pdfs: ScrapedPDF[] = [];

    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);

      $('a[href$=".pdf"], a[href*="/pdf/"]').each((_index: number, element: ReturnType<typeof $>[number]) => {
        const href = $(element).attr('href');
        const title = $(element).text().trim() || 'Government Document';

        if (href && !href.includes('advertisement')) {
          const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
          pdfs.push({
            url: fullUrl,
            title,
            source: ministryName,
            scrapedAt: new Date(),
          });
        }
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`${ministryName} scraping error:`, err.message);
    }

    return pdfs;
  },

  async downloadPDF(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxContentLength: 50 * 1024 * 1024,
      });

      return Buffer.from(response.data);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('PDF download error:', err.message);
      throw new Error(`Failed to download PDF from ${url}`);
    }
  },

  async scrapeAllPortals(): Promise<ScrapedPDF[]> {
    const portals = [
      { url: 'https://pmkisan.gov.in/', name: 'PM-KISAN' },
      { url: 'https://agricoop.nic.in/', name: 'DAC&FW' },
      { url: 'https://www.nabard.org/', name: 'NABARD' },
    ];

    const allPDFs: ScrapedPDF[] = [];

    for (const portal of portals) {
      const pdfs = await this.scrapeMinistryPortal(portal.url, portal.name);
      allPDFs.push(...pdfs);
    }

    return allPDFs;
  },
}; */

import axios from 'axios';
import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { logger } from '@utils/logger.js';

interface ScrapedPDF {
  url: string;
  title: string;
  source: string;
  scrapedAt: Date;
}

export const pdfScraperService = {
  async scrapePMKISANPortal(): Promise<ScrapedPDF[]> {
    const pdfs: ScrapedPDF[] = [];

    try {
      const response = await axios.get('https://pmkisan.gov.in/', { timeout: 10000 });
      const $ = cheerio.load(response.data);

      $('a[href$=".pdf"]').each((_index: number, element: AnyNode) => {
        const href = $(element).attr('href');
        const title = $(element).text().trim() || 'PM-KISAN Document';

        if (href) {
          pdfs.push({
            url: href.startsWith('http') ? href : `https://pmkisan.gov.in${href}`,
            title,
            source: 'PM-KISAN',
            scrapedAt: new Date(),
          });
        }
      });
    } catch (error: unknown) {
      logger.error('PM-KISAN scraping error:', (error as Error).message);
    }

    return pdfs;
  },

  async scrapeMinistryPortal(url: string, ministryName: string): Promise<ScrapedPDF[]> {
    const pdfs: ScrapedPDF[] = [];

    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);

      $('a[href$=".pdf"], a[href*="/pdf/"]').each((_index: number, element: AnyNode) => {
        const href = $(element).attr('href');
        const title = $(element).text().trim() || 'Government Document';

        if (href && !href.includes('advertisement')) {
          pdfs.push({
            url: href.startsWith('http') ? href : new URL(href, url).href,
            title,
            source: ministryName,
            scrapedAt: new Date(),
          });
        }
      });
    } catch (error: unknown) {
      logger.error(`${ministryName} scraping error:`, (error as Error).message);
    }

    return pdfs;
  },

  async downloadPDF(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxContentLength: 50 * 1024 * 1024,
      });
      return Buffer.from(response.data);
    } catch (error: unknown) {
      logger.error('PDF download error:', (error as Error).message);
      throw new Error(`Failed to download PDF from ${url}`);
    }
  },

  async scrapeAllPortals(): Promise<ScrapedPDF[]> {
    const portals = [
      { url: 'https://pmkisan.gov.in/', name: 'PM-KISAN' },
      { url: 'https://agricoop.nic.in/', name: 'DAC&FW' },
      { url: 'https://www.nabard.org/', name: 'NABARD' },
    ];

    const allPDFs: ScrapedPDF[] = [];

    for (const portal of portals) {
      const pdfs = await this.scrapeMinistryPortal(portal.url, portal.name);
      allPDFs.push(...pdfs);
    }

    return allPDFs;
  },
};