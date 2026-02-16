import { useTranslation } from '@/i18n/useTranslation';

export const useLanguage = () => {
  const { language, setLanguage, t } = useTranslation();

  const getLanguageLabel = (code: string): string => {
    const labels: Record<string, string> = {
      en: 'English',
      hi: 'हिन्दी',
      mr: 'मराठी',
      ta: 'தமிழ்',
    };
    return labels[code] || code;
  };

  return {
    language,
    setLanguage,
    t,
    getLanguageLabel,
  };
};