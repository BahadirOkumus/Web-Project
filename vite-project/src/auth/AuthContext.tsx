import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import http from '../api/http';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);

  

  const refreshMe = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await http.get('/auth/me');
      setUser(res.data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      void refreshMe();
    }
  }, [token, refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await http.post('/auth/login', { email, password });
      const t = res.data?.accessToken as string;
      setToken(t);
      localStorage.setItem('token', t);
      setUser(res.data?.user as User);
      if (t) {
        console.log('[JWT]', t);
        const parts = t.split('.');
        if (parts.length >= 2) {
          const b64 = (s: string) => {
            const pad = '='.repeat((4 - (s.length % 4)) % 4);
            const base64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
            try { return atob(base64); } catch { return ''; }
          };
          const h = b64(parts[0]);
          const p = b64(parts[1]);
          try { console.log('[JWT header]', JSON.parse(h)); } catch { console.log('[JWT header]', h); }
          try { console.log('[JWT payload]', JSON.parse(p)); } catch { console.log('[JWT payload]', p); }
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await http.post('/auth/register', { name, email, password });
      await login(email, password);
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, token, loading, login, register, logout, refreshMe }),
    [user, token, loading, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext');
  return ctx;
}
