import apiClient from './api';
import type { ChecklistItem } from '@/types/api.types';

export const documentService = {
  async getChecklist(schemeId: string, profile: Record<string, unknown>): Promise<ChecklistItem[]> {
    const response = await apiClient.post(`/documents/checklist/${schemeId}`, profile);
    return response.data.data;
  },

  async downloadChecklistHTML(schemeId: string): Promise<Blob> {
    const response = await apiClient.get(`/documents/checklist/${schemeId}/html`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadPrefilledForm(schemeId: string, farmerData: Record<string, unknown>): Promise<Blob> {
    const response = await apiClient.post(`/documents/prefill/${schemeId}`, farmerData, {
      responseType: 'blob',
    });
    return response.data;
  },

  async generateProofCard(schemeInfo: { schemeName: string }, proofData: { page: number; paragraph: string }): Promise<Blob> {
    const response = await apiClient.post('/documents/proof-card', { schemeInfo, proofData }, {
      responseType: 'blob',
    });
    return response.data;
  },
};