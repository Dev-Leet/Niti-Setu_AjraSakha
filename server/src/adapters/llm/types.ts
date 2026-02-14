export interface LLMAdapter {
  invoke(prompt: string): Promise<string>;
  stream(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}

export interface LLMConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
} 