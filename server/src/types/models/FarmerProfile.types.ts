export interface Landholding {
  totalArea: number;
  ownershipType: 'owned' | 'leased' | 'shared';
  irrigationType?: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface FarmerProfileDocument {
  _id: string;
  userId: string;
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: Landholding;
  cropTypes: string[];
  socialCategory: string;
  bankDetails?: BankDetails;
  aadharNumber?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileDTO {
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: Landholding;
  cropTypes: string[];
  socialCategory: string;
  bankDetails?: BankDetails;
  aadharNumber?: string;
}