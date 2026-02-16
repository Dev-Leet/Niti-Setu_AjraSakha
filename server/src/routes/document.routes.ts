import { Router, Response, NextFunction } from 'express';
import { formFillerService } from '@services/documents/form-filler.service.js';
import { checklistGeneratorService } from '@services/documents/checklist-generator.service.js';
import { screenshotService } from '@services/proof/screenshot.service.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.post('/checklist/:schemeId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schemeId = Array.isArray(req.params.schemeId) ? req.params.schemeId[0] : req.params.schemeId;
    const farmerProfile = req.body;

    const checklist = await checklistGeneratorService.generateDocumentChecklist(
      schemeId,
      farmerProfile
    );

    res.json({ success: true, data: checklist });
  } catch (error) {
    next(error);
  }
});

router.get('/checklist/:schemeId/html', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schemeId = Array.isArray(req.params.schemeId) ? req.params.schemeId[0] : req.params.schemeId;
    const checklist = await checklistGeneratorService.generateDocumentChecklist(schemeId, {});
    const html = checklistGeneratorService.formatChecklistAsHTML(checklist);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.post('/prefill/:schemeId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schemeId = Array.isArray(req.params.schemeId) ? req.params.schemeId[0] : req.params.schemeId;
    const farmerData = req.body;

    const filledPdf = await formFillerService.generatePreFilledApplication(schemeId, farmerData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="application_${schemeId}.pdf"`);
    res.send(filledPdf);
  } catch (error) {
    next(error);
  }
});

router.post('/proof-card', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeInfo, proofData } = req.body;

    const proofCard = await screenshotService.createProofCard(schemeInfo, proofData);

    res.setHeader('Content-Type', 'image/png');
    res.send(proofCard);
  } catch (error) {
    next(error);
  }
});

export default router;