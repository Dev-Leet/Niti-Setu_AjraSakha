import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullScreen,
  message = 'Loading your information...'
}) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.loaderWrapper}>
          <div className={`${styles.spinner} ${styles[size]}`} />
          <p className={styles.message}>{message}</p>
        </div>
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[size]}`} />;
};
