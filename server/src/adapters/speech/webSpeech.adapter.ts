export const webSpeechAdapter = {
  async transcribe(_audioBuffer: Buffer): Promise<string> {
    throw new Error('Web Speech API only works in browser context');
  },
};