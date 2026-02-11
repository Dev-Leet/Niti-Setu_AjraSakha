import { ChatOpenAI } from '@langchain/openai';
import type { LLMAdapter, LLMConfig } from './types.js';

export class OpenAIAdapter implements LLMAdapter {
  private llm: ChatOpenAI;

  constructor(config: LLMConfig) {
    this.llm = new ChatOpenAI({
      openAIApiKey: config.apiKey,
      modelName: config.model,
      temperature: config.temperature || 0.1,
      maxTokens: config.maxTokens,
    });
  }

  async invoke(prompt: string): Promise<string> {
    const response = await this.llm.invoke(prompt);
    return response.content as string;
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const stream = await this.llm.stream(prompt);
    for await (const chunk of stream) {
      onChunk(chunk.content as string);
    }
  }
}