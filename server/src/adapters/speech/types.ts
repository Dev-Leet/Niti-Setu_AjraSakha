export interface SpeechAdapter {
  transcribe(audioBuffer: Buffer, languageCode: string): Promise<TranscriptionResult>;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
} 