import { useState } from 'react';
import { voiceService } from '@/services/voice.service';

export const useVoice = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processTranscript = async (transcript: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await voiceService.extractProfile(transcript);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice input';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processTranscript,
    isProcessing,
    error,
  };
};