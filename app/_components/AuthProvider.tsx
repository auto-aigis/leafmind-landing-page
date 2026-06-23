'use client';

import {createContext, ReactNode, useCallback, useEffect, useState} from 'react';
import {User} from '@/_lib/types';
import {authApi} from '@/_lib/api';

export const AuthContext = createContext<{user: User | null; loading: boolean; refresh: () => Promise<void>; logout: () => Promise<void>} | null>(null);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <AuthContext.Provider value={{user, loading, refresh, logout}}>{children}</AuthContext.Provider>;
}
