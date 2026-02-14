import { IEligibilityCheck } from '../../models/EligibilityCheck.js';

export interface CheckEligibilityResponse {
  check: IEligibilityCheck;
  message: string;
}

export interface GetEligibilityHistoryResponse {
  checks: IEligibilityCheck[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetEligibilityByIdResponse {
  check: IEligibilityCheck;
}