import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/auth.middleware.js';
import { exportService } from '@services/export.service.js';
import fs from 'fs';

export const exportController = {
  async exportCSV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const checkId = Array.isArray(req.params.checkId) ? req.params.checkId[0] : req.params.checkId;
      const filepath = await exportService.exportEligibilityCSV(checkId);

      res.download(filepath, `eligibility-${checkId}.csv`, () => {
        fs.unlinkSync(filepath);
      });
    } catch (error) {
      next(error);
    }
  },

  async exportPDF(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const checkId = Array.isArray(req.params.checkId) ? req.params.checkId[0] : req.params.checkId;
      const filepath = await exportService.exportEligibilityPDF(checkId);

      res.download(filepath, `eligibility-${checkId}.pdf`, () => {
        fs.unlinkSync(filepath);
      });
    } catch (error) {
      next(error);
    }
  },
};