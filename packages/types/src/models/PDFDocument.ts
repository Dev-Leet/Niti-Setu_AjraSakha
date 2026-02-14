export interface IPDFDocument {
  _id: string;
  schemeId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date;
  processedDate?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  pageCount?: number;
  extractedText?: string;
  metadata?: {
    language?: string;
    author?: string;
    creationDate?: Date;
  };
  embeddings?: {
    model: string;
    dimension: number;
    createdAt: Date;
  };
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}