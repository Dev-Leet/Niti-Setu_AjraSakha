export interface User {
  id: string;
  email: string;
  role: 'farmer' | 'admin' | 'auditor';
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: {
    totalArea: number;
    ownershipType: string;
  };
  cropTypes: string[];
  socialCategory: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scheme {
  id: string;
  schemeId: string;
  name: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  ministry: string;
  category: string;
  status: 'active' | 'inactive' | 'archived';
  eligibilityRules?: {
    minLandholding?: number;
    maxLandholding?: number;
    allowedStates?: string[];
    allowedCategories?: string[];
    allowedCrops?: string[];
  };
  requiredDocuments?: string[];
  applicationDeadline?: string;
  officialUrl?: string;
}

export interface EligibilityCheck {
  id: string;
  userId: string;
  profileId: string;
  results: SchemeResult[];
  totalEligible: number;
  totalBenefits: number;
  createdAt: string;
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

export interface Citation {
  page: number;
  text: string;
  documentUrl: string;
}