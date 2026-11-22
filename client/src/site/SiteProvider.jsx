import { useEffect } from 'react';
import useApi from '../useApi';
import { SiteContext } from './context';

/** Loads the private site-wide content (landing copy, page titles, sign-off,
 *  hero video...) from /api/site once the user is logged in. */
export default function SiteProvider({ children }) {
  const { data, loading, error } = useApi('/api/site');
  // The public page title is generic; show the real site name once logged in.
  useEffect(() => {
    if (data?.siteName) document.title = data.siteName;
  }, [data?.siteName]);
  return (
    <SiteContext.Provider value={{ site: data ?? {}, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
}
