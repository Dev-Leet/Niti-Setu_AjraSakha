import { Router, Response, NextFunction } from 'express';
import { Scheme } from '@models/Scheme.model.js';
import { EligibilityRule } from '@models/EligibilityRule.model.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();
 
router.post('/compare', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeIds } = req.body;

    if (!Array.isArray(schemeIds) || schemeIds.length < 2) {
      res.status(400).json({ success: false, message: 'At least 2 scheme IDs required' });
      return;
    }

    const schemes = await Scheme.find({ _id: { $in: schemeIds } }).lean();
    const rules = await EligibilityRule.find({ schemeId: { $in: schemeIds } }).lean();

    const comparison = schemes.map(scheme => {
      const schemeRules = rules.find(r => r.schemeId === scheme._id.toString());

      return {
        schemeId: scheme._id,
        schemeName: scheme.name,
        ministry: scheme.ministry,
        benefits: scheme.benefits,
        eligibilityRules: schemeRules?.rules || [],
        applicationDeadline: scheme.applicationDeadline,
        requiredDocuments: scheme.requiredDocuments,
      };
    });

    res.json({ success: true, data: comparison });
  } catch (error) {
    next(error);
  }
});

router.get('/matrix', authenticate, async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schemes = await Scheme.find().limit(10).lean();
    const features = ['Financial Benefit', 'Land Limit', 'Categories', 'States'];

    const matrix = schemes.map(scheme => ({
      schemeId: scheme._id,
      name: scheme.name.en,
      features: {
        financialBenefit: scheme.benefits?.financial?.amount || 0,
        landLimit: scheme.eligibilityRules?.maxLandholding || 'No limit',
        categories: scheme.eligibilityRules?.allowedCategories?.join(', ') || 'All',
        states: scheme.eligibilityRules?.allowedStates?.length || 'All',
      },
    }));

    res.json({ success: true, data: { features, schemes: matrix } });
  } catch (error) {
    next(error);
  }
});

export default router;