/* import axios from 'axios';

const LLAMA_SERVICE_URL = process.env.LLAMA_SERVICE_URL || 'http://localhost:5002';

export const llamaService = {
  async generate(prompt: string, maxLength = 200): Promise<string> {
    const response = await axios.post(`${LLAMA_SERVICE_URL}/generate`, { prompt, max_length: maxLength });
    return response.data.response;
  },

  async explainEligibility(schemeName: string, eligible: boolean, citation: string, farmerProfile: any): Promise<string> {
    const prompt = `Based on the following official scheme document:
"${citation}"

Farmer Profile:
- State: ${farmerProfile.state}
- Land Holding: ${farmerProfile.landholding} acres
- Crop Type: ${farmerProfile.cropType}
- Category: ${farmerProfile.socialCategory}

Eligibility Decision: ${eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}

Provide a brief explanation in simple language (2-3 sentences):`;

    return this.generate(prompt, 150);
  },
}; */

import axios from 'axios';
import { env } from '@config/env.js';

const LLAMA_SERVICE_URL = env.LLAMA_SERVICE_URL || 'http://localhost:5002';

export const llamaService = {
  async generate(prompt: string, maxLength = 200): Promise<string> {
    try {
      const response = await axios.post(`${LLAMA_SERVICE_URL}/generate`, {
        prompt,
        max_length: maxLength,
      });

      return response.data.text;
    } catch (error) {
      throw new Error(`Llama service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async explainEligibility(
    eligible: boolean,
    citation: string,
    farmerProfile: { state: string; landholding: number; cropType: string; socialCategory: string }
  ): Promise<string> {
    const prompt = eligible
      ? `Explain in simple language why a farmer from ${farmerProfile.state} with ${farmerProfile.landholding} acres is eligible for this scheme. Reference: "${citation}"`
      : `Explain in simple language why a farmer from ${farmerProfile.state} with ${farmerProfile.landholding} acres is not eligible for this scheme. Reference: "${citation}"`;

    return this.generate(prompt, 150);
  },
};