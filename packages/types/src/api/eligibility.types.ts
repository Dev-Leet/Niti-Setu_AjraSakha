import { EligibilityCheck, EligibilityCheckInput } from '../domain/eligibility.types.js';

export type EligibilityCheckRequest = EligibilityCheckInput;

export interface EligibilityCheckResponse {
  check: EligibilityCheck;
}

export interface EligibilityHistoryQuery {
  limit?: number;
  offset?: number;
}

export interface EligibilityHistoryResponse {
  checks: EligibilityCheck[];
  total: number;
  limit: number;
  offset: number;
}