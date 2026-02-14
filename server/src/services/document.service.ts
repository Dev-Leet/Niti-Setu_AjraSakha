import { PDFDocument as PDFDocumentModel } from '@models/index.js';
import { Scheme } from '@models/index.js';
import { AppError } from '@utils/index.js';
import { getStorageAdapter } from '@/adapters/storage/index.js';
import { pdfIngestionService } from './rag/pdfIngestion.service.js';

const storage = getStorageAdapter();

export const documentService = {
  async uploadPDF(schemeId: string, file: Express.Multer.File) {
    const scheme = await Scheme.findOne({ schemeId });
    if (!scheme) {
      throw new AppError('Scheme not found', 404);
    }

    const fileUrl = await storage.uploadFile(file.buffer, file.originalname);

    const pdfDoc = await PDFDocumentModel.create({
      schemeId,
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      status: 'pending',
    });

    await pdfIngestionService.processPDF(pdfDoc._id.toString(), file.buffer, schemeId);

    return pdfDoc;
  },

  async getPDFsByScheme(schemeId: string) {
    return PDFDocumentModel.find({ schemeId }).sort({ uploadDate: -1 });
  },

  async deletePDF(pdfId: string) {
    const pdf = await PDFDocumentModel.findById(pdfId);
    if (!pdf) {
      throw new AppError('PDF not found', 404);
    }

    await storage.deleteFile(pdf.fileUrl);
    await PDFDocumentModel.findByIdAndDelete(pdfId);

    return pdf;
  },

  async getSignedUrl(fileUrl: string, expiresIn?: number) {
    return storage.getSignedUrl(fileUrl, expiresIn);
  },
};
 