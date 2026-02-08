export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface TranslationKeys {
  common: {
    home: string;
    dashboard: string;
    profile: string;
    login: string;
    logout: string;
    register: string;
    save: string;
    cancel: string;
    submit: string;
    loading: string;
    error: string;
    success: string;
  };
  home: {
    title: string;
    subtitle: string;
    ctaCheck: string;
    ctaBrowse: string;
  };
  profile: {
    createTitle: string;
    editTitle: string;
    fullName: string;
    state: string;
    district: string;
    pincode: string;
    landArea: string;
    cropTypes: string;
    socialCategory: string;
  };
  results: {
    title: string;
    eligible: string;
    notEligible: string;
    totalBenefits: string;
  };
}