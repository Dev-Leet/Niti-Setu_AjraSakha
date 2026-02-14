import api from './api';

export interface SchemeResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Array<{
    page: number;
    text: string;
    documentUrl: string;
  }>; 
  benefits: {
    financial: {
      amount: number;
      type: string;
      frequency: string;
    };
    nonFinancial: string[];
  };
}

export interface EligibilityCheckResponse {
  checkId: string;
  results: SchemeResult[];
  totalEligible: number;
  totalBenefits: number;
}

export const eligibilityService = {
  checkEligibility: async (profileId: string): Promise<EligibilityCheckResponse> => {
    const { data } = await api.post('/eligibility/check', { profileId });
    return data.data;
  },

  getCheckHistory: async (limit = 10, offset = 0) => {
    const { data } = await api.get('/eligibility/history', {
      params: { limit, offset },
    });
    return data;
  },

  getCheckById: async (checkId: string): Promise<EligibilityCheckResponse> => {
    const { data } = await api.get(`/eligibility/${checkId}`);
    return data.data;
  },
};