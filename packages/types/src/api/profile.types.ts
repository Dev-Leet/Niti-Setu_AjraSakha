import { FarmerProfile, CreateProfileInput, UpdateProfileInput } from '../domain/profile.types.js';

export type CreateProfileRequest = CreateProfileInput;

export type UpdateProfileRequest = UpdateProfileInput;

export interface ProfileResponse {
  profile: FarmerProfile;
}