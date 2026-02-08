export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const ENABLE_VOICE = import.meta.env.VITE_ENABLE_VOICE === 'true';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE_INPUT: '/profile',
  RESULTS: '/results',
  SCHEME_DETAIL: '/scheme/:id',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile/edit',
} as const;

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  MR: 'mr',
} as const;

export const SOCIAL_CATEGORIES = ['General', 'SC', 'ST', 'OBC'] as const;

export const VOICE_RECOGNITION_TIMEOUT = 120000;
export const MAX_FILE_SIZE = 10485760;