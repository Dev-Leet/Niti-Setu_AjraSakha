/* import { Router } from 'express';
import { eligibilityController } from '@controllers/eligibility.controller.js';
import { authenticate } from '@middleware/auth.middleware.js';
import { eligibilityLimiter } from '@middleware/rateLimiter.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/check', eligibilityLimiter, eligibilityController.checkEligibility);
router.get('/history', eligibilityController.getHistory);
router.get('/:id', eligibilityController.getCheckById);

export default router;  */

/* import { Router, Request, Response, NextFunction } from 'express';
//import { matcherService } from '@services/eligibility/matcher.service.js';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import { authenticate } from '@middleware/auth.middleware.js';
import { AuthRequest } from '@middleware/auth.middleware.js';
import { orchestratedMatcherService } from '@services/eligibility/orchestrated-matcher.service.js';
import { Scheme } from '@models/Scheme.model.js';
import { llmTimeoutMiddleware } from '@middleware/llm-timeout.middleware.js';

const router = Router();

/* router.post('/check', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { state, district, landholding, cropType, socialCategory, schemeId } = req.body;
    
    if (!state || !district || landholding === undefined || !cropType || !socialCategory || !schemeId) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
      return;
    }
    
    const profile = { state, district, landholding, cropType, socialCategory };
    
    const startTime = Date.now();
    const result = await matcherService.checkEligibility(profile, schemeId);
    const processingTime = Date.now() - startTime;
    
    const eligibilityCheck = await EligibilityCheck.create({
      userId: req.userId,
      profileId: req.body.profileId || null,
      results: [{
        schemeId: result.schemeName,
        schemeName: result.schemeName,
        isEligible: result.eligible,
        confidence: result.confidence.combinedConfidence,
        reasoning: result.explanation,
        citations: [{
          page: result.proof.page,
          paragraph: 0,
          text: result.proof.paragraph,
          documentUrl: '',
        }],
        benefits: { financial: { amount: 0, type: '', frequency: '' }, nonFinancial: [] },
      }],
      totalEligible: result.eligible ? 1 : 0,
      totalBenefits: 0,
      processingTime,
      cacheHit: false,
    });
    
    res.json({
      success: true,
      data: {
        ...result,
        processingTime,
        checkId: eligibilityCheck._id,
      },
    });
  } catch (error) {
    next(error);
  }
}); */

// router.post('/check', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { schemeIds, profile } = req.body;
//     const startTime = Date.now();

//     if (!Array.isArray(schemeIds) || !profile) {
//       res.status(400).json({ success: false, message: 'Invalid request' });
//       return;
//     }

//     const schemes = await Scheme.find({ _id: { $in: schemeIds } });
//     const results = [];

//     for (const scheme of schemes) {
//       const result = await orchestratedMatcherService.checkEligibility(
//         scheme._id.toString(),
//         scheme.name.en,
//         profile
//       );
//       results.push(result);
//     }

//     const processingTime = Date.now() - startTime;

//     const check = await EligibilityCheck.create({
//       userId: req.userId!,
//       results,
//       processingTime,
//       totalEligible: results.filter(r => r.isEligible).length,
//     });

//     res.json({
//       success: true,
//       data: {
//         checkId: check._id,
//         results,
//         processingTime,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post('/check', authenticate, llmTimeoutMiddleware(25000), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { schemeIds, profile } = req.body;
//     const startTime = Date.now();

//     if (!Array.isArray(schemeIds) || !profile) {
//       res.status(400).json({ success: false, message: 'Invalid request' });
//       return;
//     }

//     const schemes = await Scheme.find({ _id: { $in: schemeIds } });
//     const results = [];

//     for (const scheme of schemes) {
//       const result = await orchestratedMatcherService.checkEligibility(
//         scheme._id.toString(),
//         scheme.name.en,
//         profile
//       );
//       results.push(result);
//     }

//     const processingTime = Date.now() - startTime;

//     const check = await EligibilityCheck.create({
//       userId: req.userId!,
//       results,
//       processingTime,
//       totalEligible: results.filter(r => r.isEligible).length,
//     });

//     res.json({
//       success: true,
//       data: {
//         checkId: check._id,
//         results,
//         processingTime,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });


// router.get('/history', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
    
//     const skip = (Number(page) - 1) * Number(limit);
    
//     const checks = await EligibilityCheck.find({ userId: req.userId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));
    
//     const total = await EligibilityCheck.countDocuments({ userId: req.userId });
    
//     res.json({
//       success: true,
//       data: {
//         checks,
//         pagination: {
//           total,
//           page: Number(page),
//           limit: Number(limit),
//           totalPages: Math.ceil(total / Number(limit)),
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/:checkId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { checkId } = req.params;
    
//     const check = await EligibilityCheck.findOne({
//       _id: checkId,
//       userId: req.userId,
//     });
    
//     if (!check) {
//       res.status(404).json({ success: false, message: 'Eligibility check not found' });
//       return;
//     }
    
//     res.json({ success: true, data: check });
//   } catch (error) {
//     next(error);
//   }
// });

// export default router; */

import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';
import { orchestratedMatcherService } from '@services/eligibility/orchestrated-matcher.service.js';
import { llmTimeoutMiddleware } from '@middleware/llm-timeout.middleware.js';
import { Scheme } from '@models/Scheme.model.js';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';

const router = Router();

router.post('/check', authenticate, llmTimeoutMiddleware(25000), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeIds, profile } = req.body;
    const startTime = Date.now();

    if (!Array.isArray(schemeIds) || !profile) {
      res.status(400).json({ success: false, message: 'Invalid request body' });
      return;
    }

    const schemes = await Scheme.find({ _id: { $in: schemeIds } });

    if (schemes.length === 0) {
      res.status(404).json({ success: false, message: 'No schemes found' });
      return;
    }

    const results = [];

    for (const scheme of schemes) {
      const result = await orchestratedMatcherService.checkEligibility(
        scheme._id.toString(),
        scheme.name.en,
        profile
      );
      results.push(result);
    }

    const processingTime = Date.now() - startTime;

    const check = await EligibilityCheck.create({
      userId: req.userId!,
      results,
      processingTime,
      totalEligible: results.filter(r => r.isEligible).length,
    });

    res.json({
      success: true,
      data: {
        checkId: check._id,
        results,
        processingTime,
        totalEligible: check.totalEligible,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:checkId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { checkId } = req.params;

    const check = await EligibilityCheck.findById(checkId);

    if (!check) {
      res.status(404).json({ success: false, message: 'Check not found' });
      return;
    }

    res.json({ success: true, data: check });
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId!;
    const { limit = 10, page = 1 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const checks = await EligibilityCheck.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await EligibilityCheck.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        checks,
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

