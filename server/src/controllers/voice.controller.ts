import { Request, Response, NextFunction } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { AppError } from '@utils/AppError.js';

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: 'gpt-4o',
  temperature: 0.1,
}); 

export const voiceController = {
  async transcribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('Audio file required', 400);
      }

      res.json({
        success: true,
        data: {
          transcript: 'Mock transcript - implement Google Cloud Speech API',
          confidence: 0.95,
          language: 'hi-IN',
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async extractProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { transcript } = req.body;

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
      const extracted = JSON.parse(response.content as string);

      res.json({
        success: true,
        data: extracted,
      });
    } catch (error) {
      next(error);
    }
  },
};