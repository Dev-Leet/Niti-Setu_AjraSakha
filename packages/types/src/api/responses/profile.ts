import { IFarmerProfile } from '../../models/FarmerProfile.js';

export interface CreateProfileResponse {
  profile: IFarmerProfile;
  message: string;
}

export interface GetProfileResponse {
  profile: IFarmerProfile;
}

export interface UpdateProfileResponse {
  profile: IFarmerProfile;
  message: string;
}

export interface DeleteProfileResponse {
  message: string;
}

export interface UploadDocumentResponse {
  documentUrl: string;
  documentType: string;
  message: string;
}