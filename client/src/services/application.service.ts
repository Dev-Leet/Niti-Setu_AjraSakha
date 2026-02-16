import apiClient from './api';
import type { Application } from '@/types/api.types';

export const applicationService = {
  async submitApplication(schemeId: string, schemeName: string): Promise<Application> {
    const response = await apiClient.post('/applications/submit', { schemeId, schemeName });
    return response.data.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const response = await apiClient.get('/applications/my-applications');
    return response.data.data;
  },

  async getApplicationById(applicationId: string): Promise<Application> {
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data.data;
  },

  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<Application> {
    const response = await apiClient.put(`/applications/${applicationId}/status`, { status, notes });
    return response.data.data;
  },
};