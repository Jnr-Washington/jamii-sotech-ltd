import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, send, tokenStore, UNAUTHORIZED_EVENT } from './api';
import type { User } from './types';

interface AuthState {
  user: User | null;
  status: 'loading' | 'signed-in' | 'signed-out';
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthState['status']>(tokenStore.get() ? 'loading' : 'signed-out');

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus('signed-out');
  }, []);

  useEffect(() => {
    if (!tokenStore.get()) return;
    api<{ data: User }>('/auth/me')
      .then((r) => { setUser(r.data); setStatus('signed-in'); })
      .catch(logout);
  }, [logout]);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await send<{ data: { token: string; user: User } }>('POST', '/auth/login', { email, password });
    tokenStore.set(r.data.token);
    setUser(r.data.user);
    setStatus('signed-in');
  }, []);

  return <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
