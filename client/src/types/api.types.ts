export interface Application {
  _id: string;
  applicationId: string;
  schemeName: string;
  status: string;
  submittedAt: string;
  lastUpdated: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
  documents: Array<{
    name: string;
    uploadedAt: string;
    status: 'pending' | 'verified' | 'rejected';
  }>;
  officerNotes?: string;
}

export interface ChecklistItem {
  document: string;
  required: boolean;
  description: string;
  category: 'identity' | 'landOwnership' | 'income' | 'category' | 'other';
}

export interface VoiceProfile {
  fullName?: string;
  state?: string;
  district?: string;
  pincode?: string;
  landholding?: number;
  cropTypes?: string[];
  socialCategory?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: number;
}