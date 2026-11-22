import { useEffect, useState } from 'react';
import { api } from './auth/api';

/** GET a JSON resource from the API.
 *  Returns { data, error, notFound, loading }. `error` is true on any failure
 *  other than a 404 (which sets `notFound`). */
export default function useApi(url) {
  const [result, setResult] = useState({ url: null, data: null, error: false, notFound: false });

  useEffect(() => {
    let cancelled = false;
    api.get(url).then(
      (res) => { if (!cancelled) setResult({ url, data: res.data, error: false, notFound: false }); },
      (err) => {
        if (cancelled) return;
        const notFound = err?.response?.status === 404;
        setResult({ url, data: null, error: !notFound, notFound });
      },
    );
    return () => { cancelled = true; };
  }, [url]);

  // Until the response for the *current* url arrives, we're loading
  // (also covers navigating between e.g. two project pages).
  const loading = result.url !== url;
  return {
    data: loading ? null : result.data,
    error: !loading && result.error,
    notFound: !loading && result.notFound,
    loading,
  };
}
