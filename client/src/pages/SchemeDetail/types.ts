export interface Citation {
  page: number;
  text: string;
  documentUrl: string;
}

export interface FinancialBenefit {
  amount: number;
  type: string;
  frequency: string;
  disbursementMode: string;
}

export interface SchemeDetailData {
  id: string;
  schemeId: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  ministry: string;
  category: string;
  isEligible?: boolean;
  eligibilityRules: {
    minLandholding?: number;
    maxLandholding?: number;
    allowedStates?: string[];
    allowedCategories?: string[];
    allowedCrops?: string[];
  };
  benefits: {
    financial: FinancialBenefit;
    nonFinancial: string[];
  };
  citations?: Citation[];
  requiredDocuments: string[];
  applicationDeadline?: string;
  officialUrl: string;
}