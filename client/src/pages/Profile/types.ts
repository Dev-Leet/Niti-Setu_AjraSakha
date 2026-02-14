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