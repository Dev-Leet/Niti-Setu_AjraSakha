import { Router, Response, NextFunction } from 'express';
import { Scheme } from '@models/Scheme.model.js';
import { SchemeChunk } from '@models/SchemeChunk.model.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';
import { cacheService } from '@services/performance/cache.service.js';

const router = Router();

router.get('/', async (_req, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cached = await cacheService.get(cacheService.schemesKey());
    if (cached) {
      res.json({ success: true, data: cached, cacheHit: true });
      return;
    }

    const schemes = await Scheme.find({ status: 'active' })
      .select('name ministry description benefits eligibilityRules applicationDeadline')
      .lean();

    await cacheService.set(cacheService.schemesKey(), schemes, 3600);
    res.json({ success: true, data: schemes });
  } catch (error) {
    next(error);
  }
});

router.get('/:schemeId', async (req, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId } = req.params;
    const scheme = await Scheme.findById(schemeId).lean();

    if (!scheme) {
      res.status(404).json({ success: false, message: 'Scheme not found' });
      return;
    }

    res.json({ success: true, data: scheme });
  } catch (error) {
    next(error);
  }
});

router.get('/:schemeId/citations', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId } = req.params;
    const { page } = req.query;

    const query: Record<string, unknown> = { schemeId };
    if (page) query.pageNumber = Number(page);

    const chunks = await SchemeChunk.find(query)
      .select('chunkText pageNumber sectionTitle isEligibilitySection')
      .sort({ pageNumber: 1, chunkIndex: 1 })
      .lean();

    res.json({ success: true, data: chunks });
  } catch (error) {
    next(error);
  }
});

router.post('/:schemeId/save', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId } = req.params;
    res.json({ success: true, message: 'Scheme saved', data: { schemeId, userId: req.userId } });
  } catch (error) {
    next(error);
  }
});

router.get('/list', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 20, lightweight = 'false' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const query = { status: 'active' };

    const projection = lightweight === 'true'
      ? { name: 1, ministry: 1, status: 1, 'benefits.financial': 1, applicationDeadline: 1 }
      : {};

    const [schemes, total] = await Promise.all([
      Scheme.find(query, projection).skip(skip).limit(Number(limit)).lean(),
      Scheme.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        schemes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;