export const geminiAdapter = {
  async initialize(_config: { apiKey: string }): Promise<void> {
    throw new Error('Gemini adapter not implemented');
  },

  async generateText(_prompt: string): Promise<string> {
    throw new Error('Gemini adapter not implemented');
  },

  async streamText(_prompt: string, _onChunk: (chunk: string) => void): Promise<void> {
    throw new Error('Gemini adapter not implemented');
  },
};