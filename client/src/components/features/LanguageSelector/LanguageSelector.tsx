import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setLanguage } from '@store/slices/uiSlice';
import styles from './LanguageSelector.module.css';

export const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }, 
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <div className={styles.selector}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.langBtn} ${language === lang.code ? styles.active : ''}`}
          onClick={() => dispatch(setLanguage(lang.code as 'en' | 'hi' | 'mr'))}
        >
          <span className={styles.flag}>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};