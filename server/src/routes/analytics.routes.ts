import { Router, Response, NextFunction } from 'express';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId!;

    const totalChecks = await EligibilityCheck.countDocuments({ userId });

    const recentChecks = await EligibilityCheck.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const eligibleCount = await EligibilityCheck.countDocuments({
      userId,
      'results.isEligible': true,
    });

    const stats = {
      totalChecks,
      eligibleSchemes: eligibleCount,
      savedSchemes: 0,
      recentChecks: recentChecks.map(check => ({
        id: check._id.toString(),
        schemeName: check.results[0]?.schemeName || 'Unknown',
        date: check.createdAt,
        eligible: check.results[0]?.isEligible || false,
      })),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId!;

    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          avgProcessingTime: { $avg: '$processingTime' },
          totalEligible: { $sum: '$totalEligible' },
        },
      },
    ];

    const result = await EligibilityCheck.aggregate(pipeline);

    res.json({
      success: true,
      data: result[0] || { totalChecks: 0, avgProcessingTime: 0, totalEligible: 0 },
    });
  } catch (error) {
    next(error);
  }
});

export default router;