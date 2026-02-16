/* import { Router } from 'express';
import { schemeController } from '@controllers/scheme.controller.js';
import { authenticate } from '@middleware/index.js';

const router = Router();

router.get('/', schemeController.getAll);
router.get('/:schemeId', schemeController.getById);
router.post('/save', authenticate, schemeController.saveScheme);
router.get('/saved/all', authenticate, schemeController.getSavedSchemes);

export default router;  */

import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { pdfIngestionService } from '@services/pdf/ingestion.service.js';
import { rulesEngine } from '@services/eligibility/rules.engine.js';
import { SuggestedRule } from '@models/SuggestedRule.model.js';
import { authenticate, requireRole, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/ingest', authenticate, requireRole('admin'), upload.single('pdf'), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId, schemeName } = req.body;
    
    if (!req.file) {
      res.status(400).json({ success: false, message: 'PDF file required' });
      return;
    }
    
    await pdfIngestionService.ingestSchemePDF(schemeId, schemeName, req.file.buffer);
    
    const suggestedRules = await SuggestedRule.findOne({ schemeId, status: 'pending' });
    
    res.status(201).json({
      success: true,
      message: 'Scheme PDF ingested successfully',
      data: {
        schemeId,
        schemeName,
        suggestedRulesAvailable: !!suggestedRules,
        ruleCount: suggestedRules?.rules.length || 0,
        confidence: suggestedRules?.overallConfidence || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/suggested-rules/:schemeId', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId } = req.params;
    
    const suggestedRule = await SuggestedRule.findOne({ schemeId }).populate('rules.sourceChunkId');
    
    if (!suggestedRule) {
      res.status(404).json({ success: false, message: 'No suggested rules found' });
      return;
    }
    
    res.json({ success: true, data: suggestedRule });
  } catch (error) {
    next(error);
  }
});

router.post('/rules/approve/:ruleId', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ruleId } = req.params;
    
    const suggestedRule = await SuggestedRule.findById(ruleId);
    
    if (!suggestedRule) {
      res.status(404).json({ success: false, message: 'Suggested rule not found' });
      return;
    }
    
    await rulesEngine.createRule(suggestedRule.schemeId, suggestedRule.schemeName, suggestedRule.rules);
    
    suggestedRule.status = 'approved';
    suggestedRule.reviewedBy = req.userId;
    suggestedRule.reviewedAt = new Date();
    await suggestedRule.save();
    
    res.json({ success: true, message: 'Rules approved and applied' });
  } catch (error) {
    next(error);
  }
});

router.post('/rules/manual', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId, schemeName, rules } = req.body;
    
    await rulesEngine.createRule(schemeId, schemeName, rules);
    
    res.status(201).json({ success: true, message: 'Manual rules created' });
  } catch (error) {
    next(error);
  }
});

export default router;