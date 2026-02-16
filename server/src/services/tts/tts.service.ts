import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface TTSRequest {
  text: string;
  language: 'en' | 'hi' | 'mr' | 'ta';
}

export const ttsService = {
  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    const outputPath = path.join('/tmp', `tts_${Date.now()}.mp3`);
    
    const languageVoices = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
    };

    return new Promise((resolve, reject) => {
      const espeak = spawn('espeak-ng', [
        '-v', languageVoices[request.language],
        '-w', outputPath,
        request.text,
      ]);

      espeak.on('close', (code) => {
        if (code === 0) {
          const audioBuffer = fs.readFileSync(outputPath);
          fs.unlinkSync(outputPath);
          resolve(audioBuffer);
        } else {
          reject(new Error(`TTS generation failed with code ${code}`));
        }
      });

      espeak.on('error', reject);
    });
  },

  async streamSpeech(request: TTSRequest): Promise<NodeJS.ReadableStream> {
    const languageVoices = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
    };

    const espeak = spawn('espeak-ng', [
      '-v', languageVoices[request.language],
      '--stdout',
      request.text,
    ]);

    return espeak.stdout;
  },
};