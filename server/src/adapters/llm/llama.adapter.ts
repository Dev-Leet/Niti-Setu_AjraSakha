import type { LLMAdapter, LLMConfig } from './types.js';

export class LlamaAdapter implements LLMAdapter {
  constructor(config: LLMConfig) {
    // Implement Llama API integration
  }

  async invoke(prompt: string): Promise<string> {
    throw new Error('Llama adapter not implemented');
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    throw new Error('Llama adapter not implemented');
  }
}