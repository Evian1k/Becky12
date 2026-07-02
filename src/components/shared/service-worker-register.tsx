"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for offline support / PWA installability.
 * Only runs in production to avoid caching dev assets.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // Silent fail — service worker is a progressive enhancement.
      });
  }, []);
  return null;
}
