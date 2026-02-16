import { useState, useRef } from 'react';
import { voiceService } from '@/services/voice.service';
import { useLanguage } from '@/hooks/useLanguage';
import type { VoiceProfile, ValidationResult } from '@/types/api.types';

interface VoiceRecorderProps {
  onTranscript: (data: { profile: VoiceProfile; validation: ValidationResult }) => void;
}

export const VoiceRecorder = ({ onTranscript }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { language } = useLanguage();

  const languageMap: Record<string, 'en-IN' | 'hi-IN' | 'mr-IN' | 'ta-IN'> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const transcript = await voiceService.transcribe(audioBlob, languageMap[language]);
      const profileData = await voiceService.extractProfile(transcript);
      onTranscript(profileData);
    } catch (error) {
      console.error('Failed to process audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`px-6 py-3 rounded-full font-semibold text-white transition-colors ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        } disabled:opacity-50`}
      >
        {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
      </button>
      {isProcessing && <p className="text-gray-600">Processing audio...</p>}
    </div>
  );
};