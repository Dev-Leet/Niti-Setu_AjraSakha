export interface CheckEligibilityRequest {
  profileId: string;
  filters?: {
    states?: string[];
    ministries?: string[];
    benefitType?: string[];
    minBenefit?: number;
    maxBenefit?: number;
  };
}

export interface GetEligibilityHistoryRequest {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalBenefits' | 'totalEligible';
  sortOrder?: 'asc' | 'desc';
}