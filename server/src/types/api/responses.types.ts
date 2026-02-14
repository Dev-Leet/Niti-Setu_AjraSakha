export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
 
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  limit: number;
  offset: number;
  next?: string;
  previous?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface EligibilityCheckResponse {
  checkId: string;
  results: SchemeResult[];
  totalEligible: number;
  totalBenefits: number;
  processingTime: number;
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
  paragraph: number;
  text: string;
  documentUrl: string;
}