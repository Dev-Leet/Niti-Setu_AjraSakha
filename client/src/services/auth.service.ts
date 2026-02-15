import apiClient from './api.js';

export const authService = {
  async register(email: string, password: string, phone?: string) {
    const response = await apiClient.post('/auth/register', { email, password, phone });
    const { accessToken, refreshToken, user } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return { user, accessToken };
  },

  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return { user, accessToken };
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};