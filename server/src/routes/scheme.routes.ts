import { Router, Response, NextFunction } from 'express';
import { Scheme } from '@models/Scheme.model.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.get('/list', async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schemes = await Scheme.find({ status: 'active' }).lean();

    res.json({
      success: true,
      data: {
        schemes,
        pagination: {
          page: 1,
          limit: schemes.length,
          total: schemes.length,
          totalPages: 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:schemeId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);

    if (!scheme) {
      res.status(404).json({ success: false, message: 'Scheme not found' });
      return;
    }

    res.json({ success: true, data: scheme });
  } catch (error) {
    next(error);
  }
});

export default router;