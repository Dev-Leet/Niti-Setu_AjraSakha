import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/auth.js';
import { documentService } from '@services/document.service.js';
import { AppError } from '@utils/AppError.js';

export const documentController = {
  async uploadPDF(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schemeId } = req.body;
      const file = req.file;

      if (!file) {
        throw new AppError('File is required', 400);
      }

      const document = await documentService.uploadPDF(schemeId, file);

      res.status(201).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPDFsByScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schemeId } = req.params;
      const documents = await documentService.getPDFsByScheme(schemeId);

      res.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  },

  async deletePDF(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await documentService.deletePDF(id);

      res.json({
        success: true,
        data: { message: 'PDF deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  },
};