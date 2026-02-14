export interface CreateProfileRequest {
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
}

export interface UpdateProfileRequest extends Partial<CreateProfileRequest> {}

export interface UploadDocumentRequest {
  documentType: 'landOwnershipProof' | 'incomeProof' | 'casteCertificate';
  file: File | Buffer;
}