export interface IFarmerProfile {
  _id: string;
  userId: string;
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: {
    totalArea: number;
    ownershipType: 'owned' | 'leased' | 'sharecropped';
    irrigationType?: 'rainfed' | 'irrigated' | 'partially-irrigated';
  };
  cropTypes: string[];
  socialCategory: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName?: string;
  };
  aadharNumber?: string;
  panNumber?: string;
  income?: {
    annual: number;
    source: string;
  };
  familyMembers?: number;
  documents?: {
    landOwnershipProof?: string;
    incomeProof?: string;
    casteCertificate?: string;
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
}