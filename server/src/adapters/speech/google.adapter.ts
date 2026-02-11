import { SpeechClient } from '@google-cloud/speech';
import type { SpeechAdapter, TranscriptionResult } from './types.js';

export class GoogleSpeechAdapter implements SpeechAdapter {
  private client: SpeechClient;

  constructor() {
    this.client = new SpeechClient();
  }

  async transcribe(audioBuffer: Buffer, languageCode = 'hi-IN'): Promise<TranscriptionResult> {
    const audio = { content: audioBuffer.toString('base64') };
    const config = {
      encoding: 'WEBM_OPUS' as const,
      sampleRateHertz: 16000,
      languageCode,
    };

    const [response] = await this.client.recognize({ audio, config });
    const transcription = response.results
      ?.map((result: any) => result.alternatives?.[0]?.transcript)
      .join('\n') || '';

    return {
      transcript: transcription,
      confidence: response.results?.[0]?.alternatives?.[0]?.confidence || 0,
      language: languageCode,
    };
  }
}