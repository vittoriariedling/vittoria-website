import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../auth/api';

/** GET a list from the API. Returns { data, setData, error, reload }. */
export default function useAdminList(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api.get(url).then(
      (res) => { if (!cancelled) { setData(res.data); setError(''); } },
      (err) => { if (!cancelled) setError(errorMessage(err)); },
    );
    return () => { cancelled = true; };
  }, [url, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { data, setData, error, reload };
}
