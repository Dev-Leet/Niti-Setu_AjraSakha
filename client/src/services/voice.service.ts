import apiClient from './api';
import type { VoiceProfile, ValidationResult } from '@/types/api.types';

export const voiceService = {
  async transcribe(audioBlob: Blob, language: 'en-IN' | 'hi-IN' | 'mr-IN' | 'ta-IN' = 'en-IN'): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);

    const response = await apiClient.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data.transcript;
  },

  async extractProfile(transcript: string): Promise<{ profile: VoiceProfile; validation: ValidationResult }> {
    const response = await apiClient.post('/voice/extract', { transcript });
    return response.data.data;
  },

  async validateProfile(profile: VoiceProfile): Promise<ValidationResult> {
    const response = await apiClient.post('/voice/validate', profile);
    return response.data.data;
  },
};