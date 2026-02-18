import { llamaService } from './ml/llama.service.js';

export const voiceService = {
  async transcribe(_audioBlob: Buffer, _language: 'en-IN' | 'hi-IN' | 'mr-IN' | 'ta-IN' = 'en-IN'): Promise<string> {
    throw new Error('Voice transcription not implemented - use browser Web Speech API on client side');
  },

  async extractProfile(transcript: string): Promise<Record<string, unknown>> {
    const prompt = `Extract farmer profile from: "${transcript}"
Return JSON: {"fullName":null,"state":null,"district":null,"pincode":null,"landholding":null,"cropTypes":[],"socialCategory":null}
JSON:`;

    const response = await llamaService.generate(prompt, 200);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    return {
      fullName: null,
      state: null,
      district: null,
      pincode: null,
      landholding: null,
      cropTypes: [],
      socialCategory: null,
    };
  },
};