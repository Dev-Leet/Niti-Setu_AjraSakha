import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { VoiceInput } from './VoiceInput';
import { FormInput } from './FormInput';
import { Button } from '@components/common/Button/Button';
import styles from './ProfileInput.module.css';

export const ProfileInput: React.FC = () => {
  const [mode, setMode] = useState<'voice' | 'form'>('form');
  // const navigate = useNavigate();
 
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Create Your Profile</h1>
        <p>Share your farming details to check scheme eligibility</p>
      </div>

      <div className={styles.toggle}>
        <Button
          variant={mode === 'form' ? 'primary' : 'outline'}
          onClick={() => setMode('form')}
        >
          Form Input
        </Button>
        <Button
          variant={mode === 'voice' ? 'primary' : 'outline'}
          onClick={() => setMode('voice')}
        >
          Voice Input
        </Button>
      </div>

      <div className={styles.content}>
        {mode === 'voice' ? <VoiceInput /> : <FormInput />}
      </div>
    </div>
  );
};