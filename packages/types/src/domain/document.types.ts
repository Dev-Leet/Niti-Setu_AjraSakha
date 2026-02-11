export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PDFDocumentEntity {
  id: string;
  schemeId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: DocumentStatus;
  uploadDate: Date;
  processedAt?: Date;
  totalPages?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadDocumentInput {
  schemeId: string;
  file: File | Buffer;
}