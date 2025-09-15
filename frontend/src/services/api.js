/**
 * Axios instance for API requests with JWT auth header.
 * Reads token from localStorage and attaches Authorization header.
 */
import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    try {
      const parsed = JSON.parse(auth);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // ignore parsing errors
    }
  }
  return config;
});

// Handle common response errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // auto-logout on unauthorized
      localStorage.removeItem('auth');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
