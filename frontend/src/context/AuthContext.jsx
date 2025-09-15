import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages authentication state, persists JWT and user in localStorage,
 * and exposes methods for login, register, and logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem('auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  // Save changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('auth', JSON.stringify({ user, token }));
    }
  }, [user, token, loading]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (email, password) => {
    /**
     * Logs in and stores token and user, then returns {user, token}
     */
    const { data } = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = data;
    setUser(u);
    setToken(t);
    return { user: u, token: t };
  }, []);

  // PUBLIC_INTERFACE
  const register = useCallback(async (payload) => {
    /**
     * Registers a new user. Payload contains name, email, password.
     * Returns API response data.
     */
    const { data } = await api.post('/auth/register', payload);
    return data;
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /**
     * Clears auth and redirects to login.
     */
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
    window.location.href = '/login';
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, isAuthenticated: !!token }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
