import { Router, Response, NextFunction } from 'express';
import { ogdApiService } from '@services/external/ogd-api.service.js';
import { apisetuService } from '@services/external/apisetu.service.js';
import { pdfScraperService } from '@services/external/pdf-scraper.service.js';
import { autoDownloaderService } from '@services/schemes/auto-downloader.service.js';
import { authenticate, requireRole, AuthRequest } from '@middleware/auth.middleware.js';
 
const router = Router();

router.get('/ogd/search', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ success: false, message: 'Query parameter required' });
      return;
    }

    const results = await ogdApiService.searchAgriculturalSchemes(query as string);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

router.get('/apisetu/schemes', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sector, ministry, state } = req.query;
    const schemes = await apisetuService.searchSchemes({
      sector: sector as string,
      ministry: ministry as string,
      state: state as string,
    });

    res.json({ success: true, data: schemes });
  } catch (error) {
    next(error);
  }
});

router.post('/scrape/portals', authenticate, requireRole('admin'), async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdfs = await pdfScraperService.scrapeAllPortals();
    res.json({ success: true, data: { count: pdfs.length, pdfs } });
  } catch (error) {
    next(error);
  }
});

router.post('/auto-ingest', authenticate, requireRole('admin'), async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await autoDownloaderService.autoDiscoverAndIngestSchemes();
    res.json({ success: true, data: { ingestedCount: count } });
  } catch (error) {
    next(error);
  }
});

export default router;