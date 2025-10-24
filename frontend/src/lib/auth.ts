import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member';
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (payload: { name: string; email: string; password: string; }) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  getProfile: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  }
};

export const storeAuthData = (user: User | null, token: string | null) => {
  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) as User : null;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};