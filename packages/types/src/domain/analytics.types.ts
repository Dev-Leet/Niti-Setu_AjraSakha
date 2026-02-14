export type EventType =
  | 'user_registered'
  | 'profile_created'
  | 'profile_updated'
  | 'eligibility_checked'
  | 'scheme_viewed'
  | 'scheme_saved'
  | 'voice_input_used'
  | 'form_input_used'
  | 'pdf_uploaded'
  | 'search_performed';

export interface AnalyticsEvent {
  id: string;
  eventType: EventType;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: Date; 
}

export interface UserStats {
  totalChecks: number;
  lastCheckDate?: Date;
  totalEligibleSchemes: number;
  totalSavedSchemes: number;
  totalBenefitsAvailable: number;
}

export interface SystemStats {
  totalUsers: number;
  totalChecks: number;
  totalSchemes: number;
  avgProcessingTime: number;
  avgConfidence: number;
  popularSchemes: Array<{
    schemeId: string;
    name: string;
    checkCount: number;
  }>;
}