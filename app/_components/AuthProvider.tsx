'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Subscription } from '@/app/_lib/types';
import { authApi } from '@/app/_lib/api';

export interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const userData = await authApi.me();
      setUser(userData);
      const subData = await authApi.getSubscription();
      setSubscription(subData);
    } catch {
      setUser(null);
      setSubscription(null);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setSubscription(null);
    } catch {}
  };

  useEffect(() => {
    const init = async () => {
      await refresh();
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, subscription, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
