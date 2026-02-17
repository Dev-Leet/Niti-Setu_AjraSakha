import { Router, Response, NextFunction } from 'express';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import { Scheme } from '@models/Scheme.model.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId!;

    const [totalChecks, eligibleCount, totalSchemes, avgProcessingTime, recentChecks] = await Promise.all([
      EligibilityCheck.countDocuments({ userId }),
      EligibilityCheck.countDocuments({ userId, 'results.isEligible': true }),
      Scheme.countDocuments({ status: 'active' }),
      EligibilityCheck.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avgTime: { $avg: '$processingTime' } } },
      ]),
      EligibilityCheck.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const stats = {
      totalChecks,
      eligibleSchemes: eligibleCount,
      savedSchemes: 0,
      schemesAnalyzed: totalSchemes,
      avgResponseTime: avgProcessingTime.length > 0 ? Math.round(avgProcessingTime[0].avgTime) : 0,
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

router.get('/metrics', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalSchemes, totalUsers, totalChecks, successRate] = await Promise.all([
      Scheme.countDocuments(),
      EligibilityCheck.distinct('userId').then(users => users.length),
      EligibilityCheck.countDocuments(),
      EligibilityCheck.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            eligible: {
              $sum: {
                $cond: [{ $gt: [{ $size: { $filter: { input: '$results', cond: { $eq: ['$$this.isEligible', true] } } } }, 0] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const metrics = {
      schemesAnalyzed: totalSchemes,
      totalUsers,
      eligibilityChecksPerformed: totalChecks,
      successRate: successRate.length > 0 ? ((successRate[0].eligible / successRate[0].total) * 100).toFixed(1) : '0',
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
});

export default router;