import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import Login from './Login';
import Register from './Register';
import styles from './Auth.module.css';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {mode === 'login' ? (
          <Login onToggle={() => setMode('register')} />
        ) : (
          <Register onToggle={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}