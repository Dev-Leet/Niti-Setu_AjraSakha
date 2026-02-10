export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone?: string;
}

export interface CreateProfileRequest {
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: {
    totalArea: number;
    ownershipType: string;
    irrigationType?: string;
  };
  cropTypes: string[];
  socialCategory: string;
}

export interface EligibilityCheckRequest {
  profileId: string;
}

export interface SaveSchemeRequest {
  schemeId: string;
  notes?: string;
}

export interface TranscribeRequest {
  audio: Buffer;
  languageHint?: string;
}

export interface ExtractProfileRequest {
  transcript: string;
}