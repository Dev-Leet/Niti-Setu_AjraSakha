import { Router, Response, NextFunction } from 'express';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';
import PDFDocument from 'pdfkit';

const router = Router();

router.get('/results/:checkId/pdf', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { checkId } = req.params;

    const check = await EligibilityCheck.findOne({
      _id: checkId,
      userId: req.userId,
    }).lean();

    if (!check) {
      res.status(404).json({ success: false, message: 'Check not found' });
      return;
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="eligibility_${checkId}.pdf"`);

    doc.pipe(res);

    doc.fontSize(20).text('Eligibility Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date(check.createdAt).toLocaleDateString()}`);
    doc.text(`Processing Time: ${check.processingTime}ms`);
    doc.moveDown();

    for (const result of check.results) {
      doc.fontSize(16).text(result.schemeName);
      doc.fontSize(12).text(`Status: ${result.isEligible ? 'Eligible' : 'Not Eligible'}`);
      doc.text(`Confidence: ${(result.confidence * 100).toFixed(0)}%`);
      doc.text(`Reasoning: ${result.reasoning}`);
      doc.moveDown();
    }

    doc.end();
  } catch (error) {
    next(error);
  }
});

router.get('/results/:checkId/json', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { checkId } = req.params;

    const check = await EligibilityCheck.findOne({
      _id: checkId,
      userId: req.userId,
    }).lean();

    if (!check) {
      res.status(404).json({ success: false, message: 'Check not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="eligibility_${checkId}.json"`);
    res.json(check);
  } catch (error) {
    next(error);
  }
});

export default router;