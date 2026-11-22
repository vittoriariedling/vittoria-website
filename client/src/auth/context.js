import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/** { status: 'loading' | 'authenticated' | 'anonymous', user, login, register, logout, logoutAll } */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/** Only allow redirects to paths inside this site (no //evil.com). */
export function safeRedirect(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : '/';
}

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
