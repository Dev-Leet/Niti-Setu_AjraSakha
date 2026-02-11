export interface PDFPage {
  pageNumber: number;
  text: string;
  metadata: Record<string, any>;
}

export interface IngestionJob {
  id: string;
  pdfId: string;
  schemeId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalPages?: number;
  processedPages?: number;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface TextChunk {
  text: string;
  metadata: {
    schemeId: string;
    page: number;
    chunkIndex: number;
    totalChunks: number;
  };
}