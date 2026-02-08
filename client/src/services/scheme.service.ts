import api from './api';

export interface Scheme {
  id: string;
  schemeId: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  ministry: string;
  category: string;
  status: string;
  eligibilityRules?: {
    minLandholding?: number;
    maxLandholding?: number;
    allowedStates?: string[];
    allowedCategories?: string[];
    allowedCrops?: string[];
  };
  requiredDocuments?: string[];
  applicationDeadline?: string;
  officialUrl?: string;
}

export const schemeService = {
  getAll: async (filters?: { state?: string; ministry?: string; category?: string }) => {
    const { data } = await api.get('/schemes', { params: filters });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/schemes/${id}`);
    return data.data;
  },

  save: async (schemeId: string, notes?: string) => {
    const { data } = await api.post('/schemes/save', { schemeId, notes });
    return data.data;
  },

  getSaved: async () => {
    const { data } = await api.get('/schemes/saved');
    return data.data;
  },
};