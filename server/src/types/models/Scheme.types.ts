export interface SchemeTranslation {
  en: string;
  hi: string;
  mr?: string;
}

export interface EligibilityRules {
  minLandholding?: number;
  maxLandholding?: number;
  allowedStates?: string[];
  allowedCategories?: string[];
  allowedCrops?: string[];
  minAge?: number;
  maxAge?: number;
}

export interface FinancialBenefit {
  amount: number;
  type: string;
  frequency: string;
  disbursementMode: string;
}

export interface SchemeBenefits {
  financial: FinancialBenefit;
  nonFinancial: string[];
}

export interface PDFDocument {
  url: string;
  fileName: string;
  uploadDate: Date;
  version: string;
}

export interface SchemeDocument {
  _id: string;
  schemeId: string;
  name: SchemeTranslation;
  description: SchemeTranslation;
  ministry: string;
  category: string;
  status: 'active' | 'inactive' | 'archived';
  eligibilityRules: EligibilityRules;
  benefits: SchemeBenefits;
  requiredDocuments: string[];
  applicationDeadline?: Date;
  officialUrl: string;
  pdfDocuments: PDFDocument[];
  createdAt: Date;
  updatedAt: Date;
}