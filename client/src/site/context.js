import { createContext, useContext } from 'react';

export const SiteContext = createContext({ site: {}, loading: true, error: false });

/** { site, loading, error } — site is {} until loaded. */
export const useSite = () => useContext(SiteContext);

/** Page title/intro from site content, e.g. usePage('books') -> { title, intro }. */
export function usePage(key) {
  const { site } = useSite();
  return site.pages?.[key] ?? {};
}
