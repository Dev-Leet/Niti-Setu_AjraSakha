export interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  language?: string;
}

export interface VoiceRecognitionHook {
  isRecording: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}