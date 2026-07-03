"use client";

import { useEffect, useState } from "react";
import { resolveSrc } from "@/lib/indexeddb-storage";

/**
 * Resolves any URL (including `idb://` IndexedDB references) to a
 * displayable URL. Returns "" while loading or if the blob is missing.
 *
 * Usage:
 *   const src = useResolvedSrc(photo.src);
 *   <img src={src} />
 */
export function useResolvedSrc(src: string | undefined): string {
  const [resolved, setResolved] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setResolved("");
      return;
    }
    resolveSrc(src).then((url) => {
      if (!cancelled) setResolved(url);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return resolved;
}
