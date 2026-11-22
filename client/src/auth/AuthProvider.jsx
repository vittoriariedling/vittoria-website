import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './context';
import { api, refreshSession, setAccessToken, setSessionExpiredHandler } from './api';

// Lets tabs tell each other about logins/logouts so they stay in sync.
const CHANNEL = 'auth';

export default function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null });
  const channel = useRef(null);

  const signedIn = useCallback((data) => {
    setAccessToken(data.access_token);
    setState({ status: 'authenticated', user: data.user });
  }, []);

  const signedOut = useCallback(() => {
    setAccessToken(null);
    setState({ status: 'anonymous', user: null });
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(signedOut);
    // Restore the session from the refresh cookie, if there is one.
    refreshSession().then(signedIn, signedOut);

    if (typeof BroadcastChannel === 'undefined') return undefined;
    const ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = (e) => {
      if (e.data === 'logout') signedOut();
      if (e.data === 'login') refreshSession().then(signedIn, () => {});
    };
    channel.current = ch;
    return () => ch.close();
  }, [signedIn, signedOut]);

  const announce = (msg) => channel.current?.postMessage(msg);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    signedIn(data);
    announce('login');
  }, [signedIn]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    signedIn(data);
    announce('login');
  }, [signedIn]);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      signedOut();
      announce('logout');
    }
  }, [signedOut]);

  const logoutAll = useCallback(async () => {
    try {
      await api.post('/api/auth/logout-all');
    } finally {
      signedOut();
      announce('logout');
    }
  }, [signedOut]);

  const value = useMemo(
    () => ({ ...state, login, register, logout, logoutAll }),
    [state, login, register, logout, logoutAll],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
