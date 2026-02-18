export interface LLMResponse {
  explanation: string;
  confidenceNote: string;
}

export interface StepsResponse {
  steps: string[];
}

export interface RAGContext {
  chunks: string[];
  sources: Array<{
    page: number;
    section?: string;
  }>;
}