import api from './api';

export interface TranscriptResponse {
  transcript: string;
  confidence: number;
  language: string;
}

export interface ExtractedData {
  fullName?: string;
  state?: string;
  district?: string;
  landholding?: number;
  cropTypes?: string[];
  socialCategory?: string;
  confidence: Record<string, number>;
  missingFields: string[];
}

export const voiceService = {
  transcribe: async (audioBlob: Blob, languageHint?: string): Promise<TranscriptResponse> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    if (languageHint) formData.append('languageHint', languageHint);

    const { data } = await api.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  extractProfile: async (transcript: string): Promise<ExtractedData> => {
    const { data } = await api.post('/voice/extract', { transcript });
    return data.data;
  },
};