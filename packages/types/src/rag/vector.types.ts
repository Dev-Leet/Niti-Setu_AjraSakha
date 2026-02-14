export interface EmbeddingVector {
  id: string;
  values: number[];
  metadata: VectorMetadata;
}

export interface VectorMetadata {
  schemeId: string;
  page: number;
  paragraph?: number;
  text: string;
  fileName?: string;
  documentUrl?: string;
  [key: string]: any;
} 

export interface SearchResult {
  id: string;
  score: number;
  metadata: VectorMetadata;
}

export interface VectorSearchQuery {
  vector: number[];
  topK: number;
  filter?: Record<string, any>;
  includeMetadata?: boolean;
}