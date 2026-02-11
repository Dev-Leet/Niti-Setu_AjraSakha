export type OwnershipType = 'owned' | 'leased' | 'shared';

export type SocialCategory = 'General' | 'SC' | 'ST' | 'OBC';

export type IrrigationType = 'rainfed' | 'irrigated' | 'drip' | 'sprinkler';

export interface Landholding {
  totalArea: number;
  ownershipType: OwnershipType;
  irrigationType?: IrrigationType;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: Landholding;
  cropTypes: string[];
  socialCategory: SocialCategory;
  bankDetails?: BankDetails;
  aadharNumber?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileInput {
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: Landholding;
  cropTypes: string[];
  socialCategory: SocialCategory;
  bankDetails?: BankDetails;
  aadharNumber?: string;
}

export interface UpdateProfileInput extends Partial<CreateProfileInput> {}