"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/app/_lib/api';
import * as types from '@/app/_lib/types';

interface AuthContextType {
  user: types.User | null;
  loading: boolean;
  token: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<types.User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const storedToken = localStorage.getItem('supabase_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.me(storedToken);
      setUser(userData);
      setToken(storedToken);
    } catch {
      localStorage.removeItem('supabase_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authApi.logout(token);
      } catch {}
    }
    localStorage.removeItem('supabase_token');
    setUser(null);
    setToken(null);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, loading, token, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
