import mongoose, { Schema, Document } from 'mongoose';

export interface IPDFDocument extends Document {
  schemeId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadDate: Date;
  processedAt?: Date;
  totalPages?: number;
  errorMessage?: string;
}

const pdfDocumentSchema = new Schema<IPDFDocument>(
  {
    schemeId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    processedAt: Date,
    totalPages: Number,
    errorMessage: String,
  },
  {
    timestamps: true,
    collection: 'pdf_documents',
  }
);

export const PDFDocument = mongoose.model<IPDFDocument>('PDFDocument', pdfDocumentSchema);