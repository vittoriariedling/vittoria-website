import { useEffect, useState } from 'react';
import { api, errorMessage } from './api';

/** Validate a one-time token from the URL (invite or password reset).
 *  Returns { state: 'checking' | 'valid' | 'invalid', data, error }. */
export default function useTokenCheck(endpoint, token) {
  const [result, setResult] = useState({ state: token ? 'checking' : 'invalid', data: null, error: '' });

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    api.post(endpoint, { token })
      .then(({ data }) => !cancelled && setResult({ state: 'valid', data, error: '' }))
      .catch((err) => !cancelled && setResult({ state: 'invalid', data: null, error: errorMessage(err) }));
    return () => { cancelled = true; };
  }, [endpoint, token]);

  return result;
}
