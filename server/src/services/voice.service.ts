import { ChatOpenAI } from '@langchain/openai';
import { env } from '@config/env.js';

const llm = new ChatOpenAI({
  openAIApiKey: env.OPENAI_API_KEY,
  modelName: 'gpt-4-turbo-preview',
  temperature: 0.1,
});
 
export const voiceService = {
  async transcribe(audioBuffer: Buffer, languageHint = 'hi-IN') {
    return {
      transcript: 'Mock transcript - implement Google Cloud Speech API',
      confidence: 0.95,
      language: languageHint,
    };
  },

  async extractProfile(transcript: string) {
    const prompt = `
      Extract farmer profile information from this transcript:
      "${transcript}"
      
      Return JSON with these fields (use null if not mentioned):
      {
        "fullName": string,
        "state": string,
        "district": string,
        "pincode": string,
        "landholding": number (in acres),
        "cropTypes": string[],
        "socialCategory": "General" | "SC" | "ST" | "OBC",
        "confidence": { field: confidence_score },
        "missingFields": string[]
      }
    `;

    const response = await llm.invoke(prompt);
    return JSON.parse(response.content as string);
  },
};