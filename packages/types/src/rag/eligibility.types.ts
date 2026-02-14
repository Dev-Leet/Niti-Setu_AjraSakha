import { FarmerProfile } from '../domain/profile.types.js';
import { Scheme } from '../domain/scheme.types.js';
import { Citation } from '../domain/eligibility.types.js';

export interface EligibilityContext {
  profile: FarmerProfile;
  scheme: Scheme;
  relevantDocuments: Array<{
    text: string;
    page: number;
    score: number;
  }>;
}
 
export interface EligibilityPrompt {
  systemPrompt: string;
  userPrompt: string;
  context: EligibilityContext;
}

export interface EligibilityLLMResponse {
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Array<{
    page: number;
    text: string;
  }>;
}

export interface EligibilityEngineResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
  processingTime: number;
}