import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setLanguage } from '@store/slices/uiSlice';
import styles from './LanguageSelector.module.css';

export const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }, 
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleChange = (code: 'en' | 'hi' | 'mr') => {
    dispatch(setLanguage(code));
    localStorage.setItem('lang', code);
  };

  return (
    <div className={styles.selector}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.langBtn} ${language === lang.code ? styles.active : ''}`}
          onClick={() => handleChange(lang.code as 'en' | 'hi' | 'mr')}
        >
          <span className={styles.flag}>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};
