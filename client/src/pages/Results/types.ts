export interface ProofData {
  checkId: string;
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  citations: Array<{
    page: number;
    text: string;
    documentUrl: string;
  }>;
  generatedAt: string;
} 