export interface Citation {
  page: number;
  paragraph: number;
  text: string;
  documentUrl: string;
  confidence?: number;
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
}

export interface EligibilityCheck {
  id: string;
  userId: string;
  profileId: string;
  results: SchemeResult[];
  totalEligible: number;
  totalBenefits: number;
  processingTime: number;
  cacheHit: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCheckInput {
  profileId: string;
}