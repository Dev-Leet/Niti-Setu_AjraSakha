import { PDFDocument as PDFDocumentModel } from '@models/PDFDocument.model.js';
import { Scheme } from '@models/Scheme.js';
import { AppError } from '@utils/AppError.js';
import { s3Adapter } from '@adapters/storage/s3.adapter.js';
import { pdfIngestionService } from './rag/pdfIngestion.service.js';

export const documentService = {
  async uploadPDF(schemeId: string, file: Express.Multer.File) {
    const scheme = await Scheme.findOne({ schemeId });
    if (!scheme) {
      throw new AppError('Scheme not found', 404);
    }

    const fileUrl = await s3Adapter.uploadFile(file.buffer, file.originalname);

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

    await s3Adapter.deleteFile(pdf.fileUrl);
    await PDFDocumentModel.findByIdAndDelete(pdfId);

    return pdf;
  },
};