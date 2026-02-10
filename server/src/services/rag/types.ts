export interface EmbeddingVector {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
}

export interface PDFPage {
  pageNumber: number;
  text: string;
  metadata: Record<string, any>;
}

export interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
}

export interface Citation {
  page: number;
  paragraph: number;
  text: string;
  documentUrl: string;
}