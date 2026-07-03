"use client";

import { useEffect } from "react";
import { useContentStore } from "@/lib/content-store";
import { isSupabaseConfigured } from "@/lib/supabase-client";
import { loadAllFromSupabase, subscribeToTable } from "@/lib/supabase-data";
import { estimateStorage } from "@/lib/indexeddb-storage";

/**
 * On first mount:
 * 1. If Supabase is configured → load all content from the database, then
 *    subscribe to realtime changes so the UI updates instantly when the
 *    other partner adds/edits/deletes content.
 * 2. If Supabase is NOT configured → fall back to JSON files in /public/data
 *    (the original Local Mode behavior).
 *
 * In both cases, the Zustand store is the single source of truth for the UI.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const loaded = useContentStore((s) => s.loaded);
  const hydrate = useContentStore((s) => s.hydrate);

  useEffect(() => {
    if (loaded) return;
    let cancelled = false;

    (async () => {
      if (isSupabaseConfigured) {
        // Cloud mode: load from Supabase
        const data = await loadAllFromSupabase();
        if (cancelled) return;
        if (data) {
          hydrate(data as any);
          return;
        }
        // If load failed, fall through to JSON
      }

      // Local mode: load from JSON files
      const files = [
        "settings.json", "gallery.json", "timeline.json", "letters.json",
        "playlist.json", "quotes.json", "bucket-list.json", "future-dreams.json",
        "memories.json", "reasons.json", "special-dates.json", "places.json",
        "notes.json", "videos.json",
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
        settings, gallery, timeline, letters, playlist, quotes,
        bucketList, futureDreams, memories, reasons, specialDates,
        places, notes, videos,
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
      } as any);
    })();

    return () => {
      cancelled = true;
    };
  }, [loaded, hydrate]);

  // Auto-cleanup: when storage is over 80% full, delete photos not viewed
  // in the last 30 days (favorites are always kept). Runs once on load.
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    (async () => {
      const est = await estimateStorage();
      if (cancelled || !est || est.quota === 0) return;
      const usagePct = (est.usage / est.quota) * 100;
      if (usagePct > 80) {
        const result = useContentStore.getState().cleanupOldPhotos(30);
        if (result.deleted > 0) {
          console.log(`Auto-cleanup: freed space by removing ${result.deleted} photo(s) not viewed in 30+ days.`);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [loaded]);

  // Realtime subscriptions (only in cloud mode, after initial load)
  useEffect(() => {
    if (!isSupabaseConfigured || !loaded) return;

    const store = useContentStore.getState();
    const unsubs: (() => void)[] = [];

    // Photos
    unsubs.push(
      subscribeToTable("photos", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.gallery.photos.find((p) => p.id === newRow.id);
          if (!exists) {
            const photos = [...store.gallery.photos, {
              id: newRow.id, src: newRow.src, caption: newRow.caption || "",
              category: newRow.category || "Selfies", album: newRow.album || "Default",
              favorite: newRow.favorite || false,
            }];
            useContentStore.setState({ gallery: { ...store.gallery, photos } });
          }
        } else if (eventType === "DELETE" && oldRow) {
          const photos = store.gallery.photos.filter((p) => p.id !== oldRow.id);
          useContentStore.setState({ gallery: { ...store.gallery, photos } });
        } else if (eventType === "UPDATE" && newRow) {
          const photos = store.gallery.photos.map((p) =>
            p.id === newRow.id
              ? { ...p, src: newRow.src, caption: newRow.caption || "", favorite: newRow.favorite || false }
              : p
          );
          useContentStore.setState({ gallery: { ...store.gallery, photos } });
        }
      })
    );

    // Videos
    unsubs.push(
      subscribeToTable("videos", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.videos.find((v) => v.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              videos: [...store.videos, {
                id: newRow.id, src: newRow.src, title: newRow.title,
                description: newRow.description || "", thumbnail: newRow.thumbnail || "",
                favorite: newRow.favorite || false,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ videos: store.videos.filter((v) => v.id !== oldRow.id) });
        }
      })
    );

    // Songs
    unsubs.push(
      subscribeToTable("songs", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.playlist.songs.find((s) => s.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              playlist: {
                ...store.playlist,
                songs: [...store.playlist.songs, {
                  id: newRow.id, title: newRow.title, artist: newRow.artist || "",
                  album: newRow.album || "", duration: newRow.duration || "",
                  src: newRow.src, cover: newRow.cover || "", favorite: newRow.favorite || false,
                }],
              },
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({
            playlist: {
              ...store.playlist,
              songs: store.playlist.songs.filter((s) => s.id !== oldRow.id),
            },
          });
        }
      })
    );

    // Letters
    unsubs.push(
      subscribeToTable("letters", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.letters.find((l) => l.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              letters: [...store.letters, {
                id: newRow.id, recipient: newRow.recipient || "", date: newRow.date || "",
                signature: newRow.signature || "", preview: newRow.preview || "",
                body: Array.isArray(newRow.body) ? newRow.body : [], favorite: newRow.favorite || false,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ letters: store.letters.filter((l) => l.id !== oldRow.id) });
        }
      })
    );

    // Quotes
    unsubs.push(
      subscribeToTable("quotes", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.quotes.find((q) => q.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              quotes: [...store.quotes, {
                id: newRow.id, text: newRow.text, author: newRow.author || "",
                favorite: newRow.favorite || false, category: newRow.category || "",
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ quotes: store.quotes.filter((q) => q.id !== oldRow.id) });
        }
      })
    );

    // Timeline
    unsubs.push(
      subscribeToTable("timeline_events", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.timeline.find((t) => t.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              timeline: [...store.timeline, {
                id: newRow.id, title: newRow.title, date: newRow.date || new Date().toISOString(),
                description: newRow.description || "", image: newRow.image || "",
                emoji: newRow.emoji || "❤️", location: newRow.location || "", favorite: newRow.favorite || false,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ timeline: store.timeline.filter((t) => t.id !== oldRow.id) });
        }
      })
    );

    // Journal
    unsubs.push(
      subscribeToTable("journal_entries", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.journal.find((j) => j.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              journal: [...store.journal, {
                id: newRow.id, date: newRow.date || new Date().toISOString(),
                mood: newRow.mood || "neutral", title: newRow.title || "",
                body: newRow.body || "", photos: Array.isArray(newRow.photos) ? newRow.photos : [],
                authorId: newRow.user_id,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ journal: store.journal.filter((j) => j.id !== oldRow.id) });
        }
      })
    );

    // Bucket list
    unsubs.push(
      subscribeToTable("bucket_list_items", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.bucketList.find((b) => b.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              bucketList: [...store.bucketList, {
                id: newRow.id, title: newRow.title, description: newRow.description || "",
                emoji: newRow.emoji || "❤️", category: newRow.category || "",
                completed: newRow.completed || false,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ bucketList: store.bucketList.filter((b) => b.id !== oldRow.id) });
        }
      })
    );

    // Places
    unsubs.push(
      subscribeToTable("places", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.places.find((p) => p.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              places: [...store.places, {
                id: newRow.id, name: newRow.name, location: newRow.location || "",
                story: newRow.story || "", photos: Array.isArray(newRow.photos) ? newRow.photos : [],
                visitedDate: newRow.visited_date || new Date().toISOString().slice(0, 10),
                lat: newRow.lat ?? undefined, lng: newRow.lng ?? undefined,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ places: store.places.filter((p) => p.id !== oldRow.id) });
        }
      })
    );

    // Special dates
    unsubs.push(
      subscribeToTable("special_dates", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.specialDates.find((d) => d.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              specialDates: [...store.specialDates, {
                id: newRow.id, title: newRow.title,
                date: newRow.date || new Date().toISOString().slice(0, 10),
                emoji: newRow.emoji || "⭐", description: newRow.description || "",
                recurring: newRow.recurring !== false,
              }],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ specialDates: store.specialDates.filter((d) => d.id !== oldRow.id) });
        }
      })
    );

    // Notifications
    unsubs.push(
      subscribeToTable("notifications", ({ eventType, new: newRow, old: oldRow }) => {
        if (eventType === "INSERT" && newRow) {
          const exists = store.notifications.find((n) => n.id === newRow.id);
          if (!exists) {
            useContentStore.setState({
              notifications: [{
                id: newRow.id, type: newRow.type, title: newRow.title,
                body: newRow.body || "", date: newRow.created_at || new Date().toISOString(),
                read: newRow.read || false,
              }, ...store.notifications],
            });
          }
        } else if (eventType === "DELETE" && oldRow) {
          useContentStore.setState({ notifications: store.notifications.filter((n) => n.id !== oldRow.id) });
        }
      })
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [loaded]);

  return <>{children}</>;
}
