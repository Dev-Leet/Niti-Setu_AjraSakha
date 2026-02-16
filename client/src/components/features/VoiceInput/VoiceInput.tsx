import { useState, useEffect, useRef, useCallback } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: 'en-IN' | 'hi-IN';
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export const VoiceInput = ({ onTranscript, language = 'en-IN' }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const handleTranscript = useCallback((text: string) => {
    onTranscript(text);
    setIsListening(false);
  }, [onTranscript]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance; SpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition || (window as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition;
      
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language;
        
        rec.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          handleTranscript(transcript);
        };
        
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        
        recognitionRef.current = rec;
      }
    }
  }, [language, handleTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
    >
      {isListening ? '🎤 Listening...' : '🎤 Speak'}
    </button>
  );
};