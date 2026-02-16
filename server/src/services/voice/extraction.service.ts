import { llamaService } from '@services/ml/llama.service.js';

export const voiceExtractionService = {
  async extractProfileData(transcript: string): Promise<any> {
    const prompt = `Extract farmer profile information from this transcript:
"${transcript}"

Return ONLY a JSON object with these fields:
{
  "fullName": "string or null",
  "state": "string or null",
  "district": "string or null",
  "pincode": "string or null",
  "landholding": "number or null",
  "cropTypes": ["string"] or [],
  "socialCategory": "string or null"
}

JSON:`;

    const response = await llamaService.generate(prompt, 300);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to extract structured data');
    }
    
    return JSON.parse(jsonMatch[0]);
  },
};