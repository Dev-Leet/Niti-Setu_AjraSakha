import axios from 'axios';

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
};