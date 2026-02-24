import { ChatOpenAI } from '@langchain/openai';
import { env } from '@config/env.js';

const llm = new ChatOpenAI({
  openAIApiKey: env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
  temperature: 0.1,
});

export const llmService = {
  async invoke(prompt: string): Promise<string> {
    const response = await llm.invoke(prompt);
    return response.content as string;
  }, 

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const stream = await llm.stream(prompt);
    for await (const chunk of stream) {
      onChunk(chunk.content as string);
    }
  },
};