import React from 'react';
import { useVoice } from '@hooks/useVoice';
import { Button } from '@components/common/Button/Button';
import styles from './VoiceRecorder.module.css';

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  language?: string;
}

// export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript, language = 'hi' }) => {
export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript }) => {
  const { isRecording, transcript, error, startRecording, stopRecording } = useVoice();

  React.useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  return (
    <div className={styles.container}>
      <div className={styles.visualizer}>
        <div className={`${styles.mic} ${isRecording ? styles.active : ''}`}>
          🎤
        </div>
        {isRecording && (
          <div className={styles.waves}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        {!isRecording ? (
          <Button variant="primary" size="lg" onClick={startRecording}>
            Start Recording
          </Button>
        ) : (
          <Button variant="secondary" size="lg" onClick={stopRecording}>
            Stop Recording
          </Button>
        )}
      </div>

      {transcript && (
        <div className={styles.transcript}>
          <h4>Transcript:</h4>
          <p>{transcript}</p>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
      
      <p className={styles.hint}>
        Speak clearly about your land, crops, and location
      </p>
    </div>
  );
};