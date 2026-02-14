import api from './api';

export interface FarmerProfile {
  id: string;
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: {
    totalArea: number;
    ownershipType: string;
  };
  cropTypes: string[];
  socialCategory: string;
}
 
export const profileService = {
  create: async (profileData: Omit<FarmerProfile, 'id'>): Promise<FarmerProfile> => {
    const { data } = await api.post('/profile', profileData);
    return data.data;
  },

  get: async (): Promise<FarmerProfile> => {
    const { data } = await api.get('/profile');
    return data.data;
  },

  update: async (profileData: Partial<FarmerProfile>): Promise<FarmerProfile> => {
    const { data } = await api.patch('/profile', profileData);
    return data.data;
  },
};