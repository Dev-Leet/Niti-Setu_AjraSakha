import { useState } from 'react';
import { ttsService } from '@/services/tts.service';

interface TTSButtonProps {
  text: string;
  language?: 'en' | 'hi' | 'mr' | 'ta';
  className?: string;
}

export const TTSButton = ({ text, language = 'en', className }: TTSButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      await ttsService.playAudio(text, language);
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isPlaying}
      className={className || 'px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'}
    >
      {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
    </button>
  );
};