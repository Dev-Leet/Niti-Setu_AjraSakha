export interface TranscribeRequest {
  audio: ArrayBuffer | Uint8Array;
  languageHint?: string;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
}

export interface ExtractProfileRequest {
  transcript: string;
}

export interface ExtractedProfileData {
  fullName?: string;
  state?: string;
  district?: string;
  pincode?: string;
  landholding?: number;
  cropTypes?: string[];
  socialCategory?: string;
  confidence: Record<string, number>;
  missingFields: string[];
}