"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Photo,
  GalleryData,
  TimelineEvent,
  LoveLetter,
  Song,
  PlaylistData,
  Quote,
  BucketItem,
  FutureDream,
  MemoryItem,
  Reason,
  SpecialDate,
  Place,
  Note,
  Video,
  Settings,
} from "@/lib/types";
import { makeId } from "@/hooks/use-json-data";

/**
 * In-memory content store. Holds all editable content for the current session.
 *
 * Initial state is loaded from the JSON files in /public/data/ via the
 * ContentProvider on mount. After that, all edits (add/edit/delete/reorder)
 * happen in-memory; they are also mirrored to LocalStorage so that the
 * session survives page refreshes. To make edits permanent across devices,
 * a future backend can be plugged in by replacing the persist() storage
 * engine — the React UI does not need to change.
 */

const emptyGallery: GalleryData = {
  photos: [
    { id: "p-1", src: "/gallery/couple-1.jpg", caption: "", category: "Selfies", album: "Default" },
    { id: "p-2", src: "/gallery/couple-2.jpg", caption: "", category: "Selfies", album: "Default" },
  ],
  albums: ["Default"],
  categories: ["Selfies", "Adventures", "Funny Moments", "Dates", "Random"],
};

const emptySettings: Settings = {
  title: "Our Forever",
  subtitle: "Our story is still being written...",
  partner1: "",
  partner2: "",
  anniversaryDate: "",
  madeBy: "Made with ❤️",
  finalMessage:
    "No matter where life takes us, this little corner of the internet will always belong to us. ❤️",
  accentColor: "#ff4d6d",
  heroPhotos: [
    { id: "hero-1", src: "/gallery/couple-1.jpg", caption: "" },
    { id: "hero-2", src: "/gallery/couple-2.jpg", caption: "" },
  ],
};

type ContentState = {
  // Data
  settings: Settings;
  gallery: GalleryData;
  timeline: TimelineEvent[];
  letters: LoveLetter[];
  playlist: PlaylistData;
  quotes: Quote[];
  bucketList: BucketItem[];
  futureDreams: FutureDream[];
  memories: MemoryItem[];
  reasons: Reason[];
  specialDates: SpecialDate[];
  places: Place[];
  notes: Note[];
  videos: Video[];

  // Loading
  loaded: boolean;

  // Actions — Settings
  setSettings: (patch: Partial<Settings>) => void;

  // Actions — Gallery
  addPhoto: (photo: Omit<Photo, "id">) => void;
  addPhotos: (photos: Omit<Photo, "id">[]) => void;
  updatePhoto: (id: string, patch: Partial<Photo>) => void;
  removePhoto: (id: string) => void;
  reorderPhotos: (fromId: string, toId: string) => void;

  // Actions — Timeline
  addTimelineEvent: (e: Omit<TimelineEvent, "id">) => void;
  updateTimelineEvent: (id: string, patch: Partial<TimelineEvent>) => void;
  removeTimelineEvent: (id: string) => void;
  reorderTimeline: (fromId: string, toId: string) => void;

  // Actions — Letters
  addLetter: (l: Omit<LoveLetter, "id">) => void;
  updateLetter: (id: string, patch: Partial<LoveLetter>) => void;
  removeLetter: (id: string) => void;

  // Actions — Playlist
  addSong: (s: Omit<Song, "id">) => void;
  updateSong: (id: string, patch: Partial<Song>) => void;
  removeSong: (id: string) => void;
  setOurSong: (id: string | null) => void;

  // Actions — Quotes
  addQuote: (q: Omit<Quote, "id">) => void;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  removeQuote: (id: string) => void;

  // Actions — Bucket List
  addBucketItem: (b: Omit<BucketItem, "id">) => void;
  updateBucketItem: (id: string, patch: Partial<BucketItem>) => void;
  removeBucketItem: (id: string) => void;

  // Actions — Future Dreams
  addDream: (d: Omit<FutureDream, "id">) => void;
  updateDream: (id: string, patch: Partial<FutureDream>) => void;
  removeDream: (id: string) => void;

  // Actions — Reasons
  addReason: (r: Omit<Reason, "id">) => void;
  updateReason: (id: string, patch: Partial<Reason>) => void;
  removeReason: (id: string) => void;

  // Actions — Special Dates
  addSpecialDate: (d: Omit<SpecialDate, "id">) => void;
  updateSpecialDate: (id: string, patch: Partial<SpecialDate>) => void;
  removeSpecialDate: (id: string) => void;

  // Actions — Places
  addPlace: (p: Omit<Place, "id">) => void;
  updatePlace: (id: string, patch: Partial<Place>) => void;
  removePlace: (id: string) => void;

  // Actions — Notes
  addNote: (n: Omit<Note, "id">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  removeNote: (id: string) => void;

  // Actions — Videos
  addVideo: (v: Omit<Video, "id">) => void;
  updateVideo: (id: string, patch: Partial<Video>) => void;
  removeVideo: (id: string) => void;

  // Bulk
  hydrate: (data: Partial<ContentState>) => void;
  resetAll: () => void;
};

function reorder<T extends { id: string }>(arr: T[], fromId: string, toId: string): T[] {
  const from = arr.findIndex((x) => x.id === fromId);
  const to = arr.findIndex((x) => x.id === toId);
  if (from === -1 || to === -1 || from === to) return arr;
  const next = [...arr];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      settings: emptySettings,
      gallery: emptyGallery,
      timeline: [],
      letters: [],
      playlist: { songs: [], ourSongId: null },
      quotes: [],
      bucketList: [],
      futureDreams: [],
      memories: [],
      reasons: [],
      specialDates: [],
      places: [],
      notes: [],
      videos: [],
      loaded: false,

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addPhoto: (photo) => set((s) => ({ gallery: { ...s.gallery, photos: [...s.gallery.photos, { ...photo, id: makeId("p") }] } })),
      addPhotos: (photos) =>
        set((s) => ({
          gallery: {
            ...s.gallery,
            photos: [...s.gallery.photos, ...photos.map((p) => ({ ...p, id: makeId("p") }))],
          },
        })),
      updatePhoto: (id, patch) =>
        set((s) => ({
          gallery: {
            ...s.gallery,
            photos: s.gallery.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removePhoto: (id) =>
        set((s) => ({
          gallery: { ...s.gallery, photos: s.gallery.photos.filter((p) => p.id !== id) },
        })),
      reorderPhotos: (fromId, toId) =>
        set((s) => ({ gallery: { ...s.gallery, photos: reorder(s.gallery.photos, fromId, toId) } })),

      addTimelineEvent: (e) => set((s) => ({ timeline: [...s.timeline, { ...e, id: makeId("tl") }] })),
      updateTimelineEvent: (id, patch) =>
        set((s) => ({ timeline: s.timeline.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      removeTimelineEvent: (id) => set((s) => ({ timeline: s.timeline.filter((e) => e.id !== id) })),
      reorderTimeline: (fromId, toId) => set((s) => ({ timeline: reorder(s.timeline, fromId, toId) })),

      addLetter: (l) => set((s) => ({ letters: [...s.letters, { ...l, id: makeId("lt") }] })),
      updateLetter: (id, patch) =>
        set((s) => ({ letters: s.letters.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
      removeLetter: (id) => set((s) => ({ letters: s.letters.filter((l) => l.id !== id) })),

      addSong: (song) => set((s) => ({ playlist: { ...s.playlist, songs: [...s.playlist.songs, { ...song, id: makeId("s") }] } })),
      updateSong: (id, patch) =>
        set((s) => ({
          playlist: {
            ...s.playlist,
            songs: s.playlist.songs.map((x) => (x.id === id ? { ...x, ...patch } : x)),
          },
        })),
      removeSong: (id) =>
        set((s) => ({
          playlist: {
            ...s.playlist,
            songs: s.playlist.songs.filter((x) => x.id !== id),
            ourSongId: s.playlist.ourSongId === id ? null : s.playlist.ourSongId,
          },
        })),
      setOurSong: (id) => set((s) => ({ playlist: { ...s.playlist, ourSongId: id } })),

      addQuote: (q) => set((s) => ({ quotes: [...s.quotes, { ...q, id: makeId("q") }] })),
      updateQuote: (id, patch) =>
        set((s) => ({ quotes: s.quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),
      removeQuote: (id) => set((s) => ({ quotes: s.quotes.filter((q) => q.id !== id) })),

      addBucketItem: (b) => set((s) => ({ bucketList: [...s.bucketList, { ...b, id: makeId("b") }] })),
      updateBucketItem: (id, patch) =>
        set((s) => ({ bucketList: s.bucketList.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      removeBucketItem: (id) => set((s) => ({ bucketList: s.bucketList.filter((b) => b.id !== id) })),

      addDream: (d) => set((s) => ({ futureDreams: [...s.futureDreams, { ...d, id: makeId("d") }] })),
      updateDream: (id, patch) =>
        set((s) => ({ futureDreams: s.futureDreams.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      removeDream: (id) => set((s) => ({ futureDreams: s.futureDreams.filter((d) => d.id !== id) })),

      addReason: (r) => set((s) => ({ reasons: [...s.reasons, { ...r, id: makeId("r") }] })),
      updateReason: (id, patch) =>
        set((s) => ({ reasons: s.reasons.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
      removeReason: (id) => set((s) => ({ reasons: s.reasons.filter((r) => r.id !== id) })),

      addSpecialDate: (d) => set((s) => ({ specialDates: [...s.specialDates, { ...d, id: makeId("sd") }] })),
      updateSpecialDate: (id, patch) =>
        set((s) => ({ specialDates: s.specialDates.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      removeSpecialDate: (id) => set((s) => ({ specialDates: s.specialDates.filter((d) => d.id !== id) })),

      addPlace: (p) => set((s) => ({ places: [...s.places, { ...p, id: makeId("pl") }] })),
      updatePlace: (id, patch) =>
        set((s) => ({ places: s.places.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removePlace: (id) => set((s) => ({ places: s.places.filter((p) => p.id !== id) })),

      addNote: (n) => set((s) => ({ notes: [...s.notes, { ...n, id: makeId("n") }] })),
      updateNote: (id, patch) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addVideo: (v) => set((s) => ({ videos: [...s.videos, { ...v, id: makeId("v") }] })),
      updateVideo: (id, patch) =>
        set((s) => ({ videos: s.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      removeVideo: (id) => set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),

      hydrate: (data) => set({ ...data, loaded: true }),
      resetAll: () =>
        set({
          settings: emptySettings,
          gallery: emptyGallery,
          timeline: [],
          letters: [],
          playlist: { songs: [], ourSongId: null },
          quotes: [],
          bucketList: [],
          futureDreams: [],
          memories: [],
          reasons: [],
          specialDates: [],
          places: [],
          notes: [],
          videos: [],
          loaded: true,
        }),
    }),
    {
      name: "our-forever-content",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        settings: s.settings,
        gallery: s.gallery,
        timeline: s.timeline,
        letters: s.letters,
        playlist: s.playlist,
        quotes: s.quotes,
        bucketList: s.bucketList,
        futureDreams: s.futureDreams,
        memories: s.memories,
        reasons: s.reasons,
        specialDates: s.specialDates,
        places: s.places,
        notes: s.notes,
        videos: s.videos,
        loaded: true,
      }),
    }
  )
);
