"use client";

/**
 * IndexedDB wrapper for persistent blob storage in Local Mode.
 *
 * Problem: URL.createObjectURL(file) returns a blob URL that becomes invalid
 * the moment the page is refreshed or the tab is closed. So photos uploaded
 * in Local Mode disappear on reload — the Zustand store still has the entry,
 * but the `src` points to a dead URL.
 *
 * Solution: store the actual File/Blob in IndexedDB (which persists across
 * refreshes and tab closes), and use a special `idb://key` URL scheme in the
 * store. A resolver converts `idb://` URLs back to object URLs at render time.
 *
 * IndexedDB has no real size limit (browsers allow hundreds of MB to GB),
 * so this works for photos, videos, and audio files.
 *
 * In Cloud Mode (Supabase connected), uploads go to Supabase Storage instead
 * and `uploadToStorage()` returns a regular https URL. IndexedDB is bypassed.
 */

const DB_NAME = "our-forever-media";
const DB_VERSION = 1;
const STORE_NAME = "files";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Stores a Blob/File in IndexedDB and returns an `idb://` reference URL.
 * Use this URL as the `src` for photos, videos, songs, avatars.
 */
export async function storeBlob(blob: Blob): Promise<string> {
  const key = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return `idb://${key}`;
}

/**
 * Retrieves a Blob from IndexedDB by its `idb://` URL.
 * Returns null if not found.
 */
export async function getBlob(idbUrl: string): Promise<Blob | null> {
  if (!idbUrl.startsWith("idb://")) return null;
  const key = idbUrl.slice("idb://".length);
  const db = await openDB();
  const blob = await new Promise<Blob | null>((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
  db.close();
  return blob;
}

/**
 * Deletes a Blob from IndexedDB by its `idb://` URL.
 */
export async function deleteBlob(idbUrl: string): Promise<void> {
  if (!idbUrl.startsWith("idb://")) return;
  const key = idbUrl.slice("idb://".length);
  const db = await openDB();
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
  db.close();
}

/**
 * Cache of resolved object URLs so we don't recreate them on every render.
 * Key: idb URL, Value: object URL
 */
const urlCache = new Map<string, string>();

/**
 * Resolves any URL to a displayable URL.
 * - `idb://...` → fetches blob from IndexedDB, creates object URL, caches it
 * - `https://...` or `/path/...` → returns as-is
 * - `blob:...` → returns as-is (session-only, won't persist)
 */
export async function resolveSrc(src: string): Promise<string> {
  if (!src) return "";
  if (!src.startsWith("idb://")) return src;

  // Check cache first
  const cached = urlCache.get(src);
  if (cached) return cached;

  const blob = await getBlob(src);
  if (!blob) return ""; // Blob gone — show broken image
  const url = URL.createObjectURL(blob);
  urlCache.set(src, url);
  return url;
}

/**
 * Synchronous resolver — returns cached URL or empty string.
 * Use this in render functions; pair with useResolvedSrc hook for async.
 */
export function resolveSrcSync(src: string): string {
  if (!src) return "";
  if (!src.startsWith("idb://")) return src;
  return urlCache.get(src) || "";
}

/**
 * Clears all cached object URLs (call on sign-out to free memory).
 */
export function clearUrlCache() {
  urlCache.forEach((url) => URL.revokeObjectURL(url));
  urlCache.clear();
}

/**
 * Estimates total storage used by IndexedDB.
 * Returns bytes used, or null if estimation unavailable.
 */
export async function estimateStorage(): Promise<{ usage: number; quota: number } | null> {
  if (!navigator.storage?.estimate) return null;
  const est = await navigator.storage.estimate();
  return {
    usage: est.usage || 0,
    quota: est.quota || 0,
  };
}

/**
 * Lists all idb:// keys in storage — used for cleanup of orphaned blobs.
 */
export async function listAllKeys(): Promise<string[]> {
  const db = await openDB();
  const keys = await new Promise<string[]>((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAllKeys();
    req.onsuccess = () => resolve(req.result.map((k) => `idb://${k}`));
    req.onerror = () => resolve([]);
  });
  db.close();
  return keys;
}
