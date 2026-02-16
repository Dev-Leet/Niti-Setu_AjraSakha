import { Router, Response, NextFunction } from 'express';
import { Scheme } from '@models/Scheme.model.js';
import { User } from '@models/User.model.js';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import { SuggestedRule } from '@models/SuggestedRule.model.js';
import { autoDownloaderService } from '@services/schemes/auto-downloader.service.js';
import { authenticate, requireRole, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/stats', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalSchemes, totalChecks, pendingRules] = await Promise.all([
      User.countDocuments(),
      Scheme.countDocuments(),
      EligibilityCheck.countDocuments(),
      SuggestedRule.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSchemes,
        totalChecks,
        pendingRules,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find()
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/auto-ingest', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await autoDownloaderService.autoDiscoverAndIngestSchemes();

    res.json({
      success: true,
      data: {
        message: 'Auto-ingestion completed',
        ingestedCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/schemes/:schemeId', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId } = req.params;
    await Scheme.findByIdAndDelete(schemeId);

    res.json({ success: true, message: 'Scheme deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;