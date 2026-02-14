import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone?: string;
}
 
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials, { withCredentials: true });
    localStorage.setItem('access_token', data.accessToken);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData, { withCredentials: true });
    localStorage.setItem('access_token', data.accessToken);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};