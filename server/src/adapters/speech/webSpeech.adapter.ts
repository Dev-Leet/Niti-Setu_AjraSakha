import type { SpeechAdapter, TranscriptionResult } from './types.js';

export class WebSpeechAdapter implements SpeechAdapter {
  async transcribe(audioBuffer: Buffer, languageCode: string): Promise<TranscriptionResult> {
    return {
      transcript: 'Mock transcript from Web Speech API',
      confidence: 0.9,
      language: languageCode,
    };
  }
} 