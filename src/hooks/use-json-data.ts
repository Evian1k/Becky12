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
 * Uses crypto.randomUUID() when available (all modern browsers) so the ID
 * is a proper UUID that Supabase's uuid columns accept.
 * Falls back to a synthetic UUID for older browsers.
 */
export function makeId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: generate a UUID v4-like string
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
