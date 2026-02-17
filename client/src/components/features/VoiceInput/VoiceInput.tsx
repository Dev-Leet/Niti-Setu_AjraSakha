import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/common/Button/Button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: 'en-IN' | 'hi-IN' | 'mr-IN' | 'ta-IN';
  continuous?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export const VoiceInput = ({ onTranscript, language = 'en-IN', continuous = false }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const handleResult = useCallback((event: Event) => {
    const speechEvent = event as SpeechRecognitionEvent;
    const results = speechEvent.results;
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = speechEvent.resultIndex; i < results.length; i++) {
      const result = results[i];
      const transcriptText = result[0].transcript;
      
      if (result.isFinal) {
        finalTranscript += transcriptText + ' ';
      } else {
        interimTranscript += transcriptText;
      }
    }

    if (finalTranscript) {
      setTranscript(prev => prev + finalTranscript);
      onTranscript(finalTranscript.trim());
    } else if (interimTranscript) {
      setTranscript(prev => prev + interimTranscript);
    }
  }, [onTranscript]);

  const handleEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const handleError = useCallback((event: Event) => {
    const errorEvent = event as SpeechRecognitionErrorEvent;
    setError(`Speech recognition error: ${errorEvent.error}`);
    setIsListening(false);
  }, []);

  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('end', handleEnd);
    recognition.addEventListener('error', handleError);

    return recognition;
  }, [language, continuous, handleResult, handleEnd, handleError]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    if (recognitionRef.current) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? 'secondary' : 'primary'}
          disabled={!!error && !isListening}
        >
          {isListening ? '⏹️ Stop' : '🎤 Start Voice Input'}
        </Button>
      </div>

      {isListening && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <span className="animate-pulse">🔴</span>
          <span>Listening...</span>
        </div>
      )}

      {transcript && (
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium mb-1">Transcript:</p>
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};