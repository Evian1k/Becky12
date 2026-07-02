"use client";

import { useEffect } from "react";
import { useContentStore } from "@/lib/content-store";

/**
 * On first mount, fetches all JSON files from /public/data/ and hydrates the
 * Zustand store. If the user has previously edited content (mirrored to
 * LocalStorage via the persist middleware), the persisted version wins and
 * we skip the fetch — so their edits survive refresh.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const loaded = useContentStore((s) => s.loaded);
  const hydrate = useContentStore((s) => s.hydrate);

  useEffect(() => {
    if (loaded) return;
    let cancelled = false;

    (async () => {
      const files = [
        "settings.json",
        "gallery.json",
        "timeline.json",
        "letters.json",
        "playlist.json",
        "quotes.json",
        "bucket-list.json",
        "future-dreams.json",
        "memories.json",
        "reasons.json",
        "special-dates.json",
        "places.json",
        "notes.json",
        "videos.json",
      ];

      const results = await Promise.all(
        files.map(async (f) => {
          try {
            const r = await fetch(`/data/${f}?t=${Date.now()}`);
            if (!r.ok) return null;
            return await r.json();
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const [
        settings,
        gallery,
        timeline,
        letters,
        playlist,
        quotes,
        bucketList,
        futureDreams,
        memories,
        reasons,
        specialDates,
        places,
        notes,
        videos,
      ] = results;

      hydrate({
        settings: settings ?? undefined,
        gallery: gallery ?? undefined,
        timeline: timeline?.events ?? undefined,
        letters: letters?.letters ?? undefined,
        playlist: playlist ?? undefined,
        quotes: quotes?.quotes ?? undefined,
        bucketList: bucketList?.items ?? undefined,
        futureDreams: futureDreams?.dreams ?? undefined,
        memories: memories?.items ?? undefined,
        reasons: reasons?.reasons ?? undefined,
        specialDates: specialDates?.dates ?? undefined,
        places: places?.places ?? undefined,
        notes: notes?.notes ?? undefined,
        videos: videos?.videos ?? undefined,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [loaded, hydrate]);

  return <>{children}</>;
}
