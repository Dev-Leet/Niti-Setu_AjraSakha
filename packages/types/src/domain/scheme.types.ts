export type SchemeStatus = 'active' | 'inactive' | 'archived';

export type BenefitType = 'subsidy' | 'grant' | 'loan' | 'insurance' | 'other';

export type BenefitFrequency = 'one-time' | 'annual' | 'monthly' | 'quarterly';

export type DisbursementMode = 'DBT' | 'check' | 'cash' | 'kind';

export interface SchemeTranslation {
  en: string;
  hi: string;
  mr?: string;
}

export interface EligibilityRules {
  minLandholding?: number;
  maxLandholding?: number;
  allowedStates?: string[];
  allowedDistricts?: string[];
  allowedCategories?: SocialCategory[];
  allowedCrops?: string[];
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maxIncome?: number;
}

export interface FinancialBenefit {
  amount: number;
  type: BenefitType;
  frequency: BenefitFrequency;
  disbursementMode: DisbursementMode;
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
  fileSize?: number;
}

export interface Scheme {
  id: string;
  schemeId: string;
  name: SchemeTranslation;
  description: SchemeTranslation;
  ministry: string;
  category: string;
  status: SchemeStatus;
  eligibilityRules: EligibilityRules;
  benefits: SchemeBenefits;
  requiredDocuments: string[];
  applicationDeadline?: Date;
  officialUrl: string;
  pdfDocuments: PDFDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSchemeInput {
  schemeId: string;
  name: SchemeTranslation;
  description: SchemeTranslation;
  ministry: string;
  category: string;
  eligibilityRules: EligibilityRules;
  benefits: SchemeBenefits;
  requiredDocuments: string[];
  applicationDeadline?: Date;
  officialUrl: string;
}

export interface UpdateSchemeInput extends Partial<CreateSchemeInput> {
  status?: SchemeStatus;
}