export const llamaAdapter = {
  async initialize(_config: { modelPath: string }): Promise<void> {
    throw new Error('Llama adapter not implemented');
  },

  async generateText(_prompt: string): Promise<string> {
    throw new Error('Llama adapter not implemented');
  },

  async streamText(_prompt: string, _onChunk: (chunk: string) => void): Promise<void> {
    throw new Error('Llama adapter not implemented');
  },
};