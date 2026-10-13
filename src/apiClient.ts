import axios, { AxiosInstance } from 'axios';
import { clearToken, getToken } from '@/lib/auth';

// Set VITE_API_URL in .env / Vercel (e.g. https://brainly-wzoi.onrender.com). Defaults to a local backend.
export const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // the free Render tier needs a while to wake up
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or invalid token: forget it and go to sign-in (but not for failed sign-in/sign-up attempts)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error?.config?.url ?? '';
    if (error?.response?.status === 401 && !url.includes('/api/signin') && !url.includes('/api/signup')) {
      clearToken();
      if (window.location.pathname !== '/sign-in-page') window.location.href = '/sign-in-page';
    }
    return Promise.reject(error);
  },
);

export const errorMessage = (err: unknown, fallback = 'Something went wrong'): string => {
  if (axios.isAxiosError(err)) return err.response?.data?.message || err.response?.data?.error || (err.response ? fallback : 'Cannot reach the server');
  return fallback;
};
