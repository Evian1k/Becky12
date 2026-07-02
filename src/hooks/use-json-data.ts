"use client";

import { useEffect, useState } from "react";

/**
 * Fetches a JSON file from /public/data/ on the client.
 * Returns null while loading and on error.
 * Because the files live in /public, no API route is needed.
 */
export function useJsonData<T>(filename: string, initial: T): { data: T; loading: boolean; reload: () => void } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/data/${filename}?t=${Date.now()}_${nonce}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json as T);
          setLoading(false);
        }
      })
      .catch(() => {
        // File missing or invalid — fall back to initial empty state.
        if (!cancelled) {
          setData(initial);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
     
  }, [filename, nonce]);

  return { data, loading, reload: () => setNonce((n) => n + 1) };
}

/**
 * Generates a unique id for new content items.
 */
export function makeId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
