import axios from 'axios';

const TRANSLATION_CACHE = new Map<string, any>();

interface TranslationResponse {
  hi: string;
  mr: string;
  ta: string;
}

export const translationService = {
  async translateText(text: string, sourceLang = 'en'): Promise<TranslationResponse> {
    const cacheKey = `${sourceLang}:${text}`;
    
    if (TRANSLATION_CACHE.has(cacheKey)) {
      return TRANSLATION_CACHE.get(cacheKey);
    }

    const translations = await Promise.all([
      this.translateToLanguage(text, sourceLang, 'hi'),
      this.translateToLanguage(text, sourceLang, 'mr'),
      this.translateToLanguage(text, sourceLang, 'ta'),
    ]);

    const result = {
      hi: translations[0],
      mr: translations[1],
      ta: translations[2],
    };

    TRANSLATION_CACHE.set(cacheKey, result);
    return result;
  },

  async translateToLanguage(text: string, from: string, to: string): Promise<string> {
    try {
      const response = await axios.post('https://libretranslate.com/translate', {
        q: text,
        source: from,
        target: to,
        format: 'text',
      });
      return response.data.translatedText;
    } catch {
      return text;
    }
  },

  async translateSchemeContent(content: { en: string }): Promise<{ en: string; hi: string; mr: string; ta: string }> {
    const translations = await this.translateText(content.en);
    return {
      en: content.en,
      ...translations,
    };
  },
};