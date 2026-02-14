export interface ProfileFormData {
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  totalArea: number;
  ownershipType: string;
  cropTypes: string[];
  socialCategory: string;
  bankAccount?: string;
  aadharNumber?: string;
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

export type InputMode = 'voice' | 'form';

export interface VoiceInputData {
  transcript: string;
  extractedData: ExtractedProfileData | null;
  loading: boolean;
  error: string | null;
}