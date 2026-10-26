import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from './api';

// Fetches `path` whenever it changes. Keeps the previous data while refetching so
// the page holds its frame (shown dimmed) instead of flashing a loading state.
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [nonce, setNonce] = useState(0);
  // The request whose result is currently shown; loading while it differs from the wanted one.
  const [settled, setSettled] = useState<string | null>(null);
  const key = path === null ? null : `${path}#${nonce}`;

  useEffect(() => {
    if (path === null) return;
    const requestKey = `${path}#${nonce}`;
    let cancelled = false;
    api<T>(path)
      .then((d) => { if (!cancelled) { setData(d); setError(null); setSettled(requestKey); } })
      .catch((e: ApiError) => { if (!cancelled) { setError(e); setSettled(requestKey); } });
    return () => { cancelled = true; };
  }, [path, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, setData, error, loading: key !== null && settled !== key, reload };
}
