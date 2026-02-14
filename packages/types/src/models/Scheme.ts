export interface IScheme {
  _id: string;
  schemeId: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  ministry: string;
  department: string;
  launchDate: Date;
  endDate?: Date;
  isActive: boolean;
  targetAudience: string[];
  eligibility: {
    minAge?: number;
    maxAge?: number;
    states: string[];
    socialCategories: string[];
    minLandholding?: number;
    maxLandholding?: number;
    incomeLimit?: number;
    cropTypes?: string[];
    customCriteria?: Record<string, any>;
  };
  benefits: {
    financial: {
      amount: number;
      type: 'subsidy' | 'loan' | 'grant' | 'insurance' | 'pension';
      frequency: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
    };
    nonFinancial: string[];
  };
  applicationProcess: {
    mode: 'online' | 'offline' | 'both';
    url?: string;
    steps: string[];
  };
  requiredDocuments: string[];
  officialWebsite?: string;
  contactDetails?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  tags: string[];
  viewCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}