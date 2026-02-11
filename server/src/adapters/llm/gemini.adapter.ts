import type { LLMAdapter, LLMConfig } from './types.js';

export class GeminiAdapter implements LLMAdapter {
  constructor(config: LLMConfig) {
    // Implement Gemini API integration
  }

  async invoke(prompt: string): Promise<string> {
    throw new Error('Gemini adapter not implemented');
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    throw new Error('Gemini adapter not implemented');
  }
}