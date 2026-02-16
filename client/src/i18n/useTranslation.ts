import { useState, useEffect } from 'react';
import { translations, Language } from './translations';

type TranslationValue = string | Record<string, string | Record<string, string>>;

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (section: string, key: string): string => {
    const parts = section.split('.');
    let value: TranslationValue = translations[language];
    
    for (const part of parts) {
      if (typeof value === 'object' && value !== null && part in value) {
        value = value[part] as TranslationValue;
      } else {
        return key;
      }
    }
    
    if (typeof value === 'object' && value !== null && key in value) {
      const result = value[key];
      return typeof result === 'string' ? result : key;
    }
    
    return key;
  };

  return { t, language, setLanguage };
};