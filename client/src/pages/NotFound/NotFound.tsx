import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button/Button';
import styles from './NotFound.module.css';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.text}>
        The page you're looking for doesn't exist.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </div>
  );
};