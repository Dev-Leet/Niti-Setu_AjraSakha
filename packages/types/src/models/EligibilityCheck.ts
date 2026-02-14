export interface Citation {
  page: number;
  paragraph: number;
  text: string;
  documentUrl: string;
}

export interface SchemeResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
  benefits: {
    financial: {
      amount: number;
      type: string;
      frequency: string;
    };
    nonFinancial: string[];
  };
  matchedCriteria: string[];
  failedCriteria?: string[];
  recommendations?: string[];
}

export interface IEligibilityCheck {
  _id: string;
  userId: string;
  profileId: string;
  results: SchemeResult[];
  totalEligible: number;
  totalBenefits: number;
  processingTime: number;
  cacheHit: boolean;
  metadata?: {
    searchQuery?: string;
    filters?: Record<string, any>;
    aiModel?: string;
    vectorScore?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}