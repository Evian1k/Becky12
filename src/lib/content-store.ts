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
  JournalEntry,
  Notification,
  Achievement,
  Settings,
} from "@/lib/types";
import { makeId } from "@/hooks/use-json-data";
import {
  dbInsertPhoto, dbUpdatePhoto, dbDeletePhoto,
  dbInsertVideo, dbDeleteVideo,
  dbInsertSong, dbDeleteSong,
  dbInsertLetter, dbDeleteLetter,
  dbInsertQuote, dbDeleteQuote,
  dbInsertTimelineEvent, dbDeleteTimelineEvent,
  dbInsertJournalEntry, dbDeleteJournalEntry,
  dbInsertBucketItem, dbDeleteBucketItem,
  dbInsertPlace, dbDeletePlace,
  dbInsertSpecialDate, dbDeleteSpecialDate,
  dbInsertReason, dbDeleteReason,
  dbInsertDream, dbDeleteDream,
  dbInsertNotification,
} from "@/lib/supabase-writes";

const emptyGallery: GalleryData = {
  photos: [],
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
  themeColor: "#ff4d6d",
  animationsEnabled: true,
  musicEnabled: true,
  notificationsEnabled: true,
  floatingHeartsEnabled: true,
  particlesEnabled: true,
};

const defaultAchievements: Achievement[] = [
  { id: "ach-1", title: "First Photo", description: "Upload your first photo together", emoji: "📸", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-2", title: "Centenarian", description: "Upload 100 photos", emoji: "💯", unlockedAt: null, progress: 0, target: 100 },
  { id: "ach-3", title: "First Letter", description: "Write your first love letter", emoji: "💌", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-4", title: "First Song", description: "Add your first song to the playlist", emoji: "🎵", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-5", title: "DJ Couple", description: "Upload 50 songs together", emoji: "🎧", unlockedAt: null, progress: 0, target: 50 },
  { id: "ach-6", title: "First Memory", description: "Add your first timeline memory", emoji: "✨", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-7", title: "Storyteller", description: "Write 10 timeline memories", emoji: "📖", unlockedAt: null, progress: 0, target: 10 },
  { id: "ach-8", title: "First Quote", description: "Add your first love quote", emoji: "💬", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-9", title: "100 Love Notes", description: "Write 100 reasons you love each other", emoji: "❤️", unlockedAt: null, progress: 0, target: 100 },
  { id: "ach-10", title: "First Video", description: "Upload your first video", emoji: "🎥", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-11", title: "First Place", description: "Add the first place you visited together", emoji: "📍", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-12", title: "Globetrotters", description: "Visit 10 places together", emoji: "🌍", unlockedAt: null, progress: 0, target: 10 },
  { id: "ach-13", title: "Bucket List Done", description: "Complete your entire bucket list", emoji: "🏆", unlockedAt: null, progress: 0, target: 1 },
  { id: "ach-14", title: "Journal Keeper", description: "Write 30 journal entries", emoji: "📔", unlockedAt: null, progress: 0, target: 30 },
  { id: "ach-15", title: "7-Day Streak", description: "Keep a 7-day streak alive", emoji: "🔥", unlockedAt: null, progress: 0, target: 7 },
  { id: "ach-16", title: "30-Day Streak", description: "Keep a 30-day streak alive", emoji: "⚡", unlockedAt: null, progress: 0, target: 30 },
  { id: "ach-17", title: "365-Day Streak", description: "Keep a 365-day streak alive", emoji: "👑", unlockedAt: null, progress: 0, target: 365 },
  { id: "ach-18", title: "First Journal", description: "Write your first journal entry", emoji: "✏️", unlockedAt: null, progress: 0, target: 1 },
];

type ContentState = {
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
  journal: JournalEntry[];
  notifications: Notification[];
  achievements: Achievement[];

  loaded: boolean;
  currentUserId: string | null;
  setUserId: (id: string | null) => void;

  // Settings
  setSettings: (patch: Partial<Settings>) => void;

  // Gallery
  addPhoto: (photo: Omit<Photo, "id">) => void;
  addPhotos: (photos: Omit<Photo, "id">[]) => void;
  updatePhoto: (id: string, patch: Partial<Photo>) => void;
  removePhoto: (id: string) => void;
  reorderPhotos: (fromId: string, toId: string) => void;

  // Timeline
  addTimelineEvent: (e: Omit<TimelineEvent, "id">) => void;
  updateTimelineEvent: (id: string, patch: Partial<TimelineEvent>) => void;
  removeTimelineEvent: (id: string) => void;
  reorderTimeline: (fromId: string, toId: string) => void;

  // Letters
  addLetter: (l: Omit<LoveLetter, "id">) => void;
  updateLetter: (id: string, patch: Partial<LoveLetter>) => void;
  removeLetter: (id: string) => void;

  // Playlist
  addSong: (s: Omit<Song, "id">) => void;
  updateSong: (id: string, patch: Partial<Song>) => void;
  removeSong: (id: string) => void;
  setOurSong: (id: string | null) => void;

  // Quotes
  addQuote: (q: Omit<Quote, "id">) => void;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  removeQuote: (id: string) => void;

  // Bucket List
  addBucketItem: (b: Omit<BucketItem, "id">) => void;
  updateBucketItem: (id: string, patch: Partial<BucketItem>) => void;
  removeBucketItem: (id: string) => void;

  // Future Dreams
  addDream: (d: Omit<FutureDream, "id">) => void;
  updateDream: (id: string, patch: Partial<FutureDream>) => void;
  removeDream: (id: string) => void;

  // Reasons
  addReason: (r: Omit<Reason, "id">) => void;
  updateReason: (id: string, patch: Partial<Reason>) => void;
  removeReason: (id: string) => void;

  // Special Dates
  addSpecialDate: (d: Omit<SpecialDate, "id">) => void;
  updateSpecialDate: (id: string, patch: Partial<SpecialDate>) => void;
  removeSpecialDate: (id: string) => void;

  // Places
  addPlace: (p: Omit<Place, "id">) => void;
  updatePlace: (id: string, patch: Partial<Place>) => void;
  removePlace: (id: string) => void;

  // Notes
  addNote: (n: Omit<Note, "id">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  removeNote: (id: string) => void;

  // Videos
  addVideo: (v: Omit<Video, "id">) => void;
  updateVideo: (id: string, patch: Partial<Video>) => void;
  removeVideo: (id: string) => void;

  // Journal
  addJournalEntry: (j: Omit<JournalEntry, "id">) => void;
  updateJournalEntry: (id: string, patch: Partial<JournalEntry>) => void;
  removeJournalEntry: (id: string) => void;

  // Notifications
  addNotification: (n: Omit<Notification, "id" | "date" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;

  // Achievements
  recomputeAchievements: (streak: number) => void;

  // Bulk
  hydrate: (data: Partial<ContentState>) => void;
  resetAll: () => void;

  // Auto-cleanup
  cleanupOldPhotos: (maxAgeDays?: number) => { deleted: number; remaining: number };
  markPhotoViewed: (id: string) => void;
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
    (set, get) => ({
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
      journal: [],
      notifications: [],
      achievements: defaultAchievements,
      loaded: false,
      currentUserId: null,

      setUserId: (id) => set({ currentUserId: id }),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addPhoto: (photo) =>
        set((s) => {
          const now = new Date().toISOString();
          const newPhoto = { ...photo, id: makeId("p"), uploadedAt: now, lastViewed: now };
          const photos = [...s.gallery.photos, newPhoto];
          // Sync to Supabase (async, non-blocking)
          if (s.currentUserId) dbInsertPhoto(newPhoto, s.currentUserId);
          return {
            gallery: { ...s.gallery, photos },
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "photo" as const, title: "New photo added", body: photo.caption || "A new memory captured", date: now, read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      addPhotos: (photos) =>
        set((s) => {
          const now = new Date().toISOString();
          const newPhotos = photos.map((p) => ({ ...p, id: makeId("p"), uploadedAt: now, lastViewed: now }));
          // Sync each to Supabase
          if (s.currentUserId) newPhotos.forEach((p) => dbInsertPhoto(p, s.currentUserId));
          return {
            gallery: {
              ...s.gallery,
              photos: [...s.gallery.photos, ...newPhotos],
            },
          };
        }),
      updatePhoto: (id, patch) =>
        set((s) => {
          if (s.currentUserId) dbUpdatePhoto(id, patch);
          return {
            gallery: {
              ...s.gallery,
              photos: s.gallery.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
            },
          };
        }),
      removePhoto: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeletePhoto(id);
          return { gallery: { ...s.gallery, photos: s.gallery.photos.filter((p) => p.id !== id) } };
        }),
      reorderPhotos: (fromId, toId) =>
        set((s) => ({ gallery: { ...s.gallery, photos: reorder(s.gallery.photos, fromId, toId) } })),

      addTimelineEvent: (e) =>
        set((s) => {
          const newEvent = { ...e, id: makeId("tl") };
          if (s.currentUserId) dbInsertTimelineEvent(newEvent, s.currentUserId);
          return {
            timeline: [...s.timeline, newEvent],
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "timeline" as const, title: "New memory added", body: e.title, date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updateTimelineEvent: (id, patch) =>
        set((s) => ({ timeline: s.timeline.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      removeTimelineEvent: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteTimelineEvent(id);
          return { timeline: s.timeline.filter((e) => e.id !== id) };
        }),
      reorderTimeline: (fromId, toId) =>
        set((s) => ({ timeline: reorder(s.timeline, fromId, toId) })),

      addLetter: (l) =>
        set((s) => {
          const newLetter = { ...l, id: makeId("lt") };
          if (s.currentUserId) dbInsertLetter(newLetter, s.currentUserId);
          return {
            letters: [...s.letters, newLetter],
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "letter" as const, title: "New letter received", body: l.preview || l.recipient, date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updateLetter: (id, patch) =>
        set((s) => ({ letters: s.letters.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
      removeLetter: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteLetter(id);
          return { letters: s.letters.filter((l) => l.id !== id) };
        }),

      addSong: (song) =>
        set((s) => {
          const newSong = { ...song, id: makeId("s") };
          if (s.currentUserId) dbInsertSong(newSong, s.currentUserId);
          return {
            playlist: { ...s.playlist, songs: [...s.playlist.songs, newSong] },
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "song" as const, title: "New song added", body: song.title, date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updateSong: (id, patch) =>
        set((s) => ({
          playlist: {
            ...s.playlist,
            songs: s.playlist.songs.map((x) => (x.id === id ? { ...x, ...patch } : x)),
          },
        })),
      removeSong: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteSong(id);
          return {
            playlist: {
              ...s.playlist,
              songs: s.playlist.songs.filter((x) => x.id !== id),
              ourSongId: s.playlist.ourSongId === id ? null : s.playlist.ourSongId,
            },
          };
        }),
      setOurSong: (id) => set((s) => ({ playlist: { ...s.playlist, ourSongId: id } })),

      addQuote: (q) =>
        set((s) => {
          const newQuote = { ...q, id: makeId("q") };
          if (s.currentUserId) dbInsertQuote(newQuote, s.currentUserId);
          return {
            quotes: [...s.quotes, newQuote],
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "quote" as const, title: "New quote added", body: q.text.slice(0, 60), date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updateQuote: (id, patch) =>
        set((s) => ({ quotes: s.quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),
      removeQuote: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteQuote(id);
          return { quotes: s.quotes.filter((q) => q.id !== id) };
        }),

      addBucketItem: (b) =>
        set((s) => {
          const newItem = { ...b, id: makeId("b") };
          if (s.currentUserId) dbInsertBucketItem(newItem, s.currentUserId);
          return { bucketList: [...s.bucketList, newItem] };
        }),
      updateBucketItem: (id, patch) =>
        set((s) => ({ bucketList: s.bucketList.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      removeBucketItem: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteBucketItem(id);
          return { bucketList: s.bucketList.filter((b) => b.id !== id) };
        }),

      addDream: (d) =>
        set((s) => {
          const newDream = { ...d, id: makeId("d") };
          if (s.currentUserId) dbInsertDream(newDream, s.currentUserId);
          return { futureDreams: [...s.futureDreams, newDream] };
        }),
      updateDream: (id, patch) =>
        set((s) => ({ futureDreams: s.futureDreams.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      removeDream: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteDream(id);
          return { futureDreams: s.futureDreams.filter((d) => d.id !== id) };
        }),

      addReason: (r) =>
        set((s) => {
          const newReason = { ...r, id: makeId("r") };
          if (s.currentUserId) dbInsertReason(newReason, s.currentUserId);
          return { reasons: [...s.reasons, newReason] };
        }),
      updateReason: (id, patch) =>
        set((s) => ({ reasons: s.reasons.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
      removeReason: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteReason(id);
          return { reasons: s.reasons.filter((r) => r.id !== id) };
        }),

      addSpecialDate: (d) =>
        set((s) => {
          const newDate = { ...d, id: makeId("sd") };
          if (s.currentUserId) dbInsertSpecialDate(newDate, s.currentUserId);
          return { specialDates: [...s.specialDates, newDate] };
        }),
      updateSpecialDate: (id, patch) =>
        set((s) => ({ specialDates: s.specialDates.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      removeSpecialDate: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteSpecialDate(id);
          return { specialDates: s.specialDates.filter((d) => d.id !== id) };
        }),

      addPlace: (p) =>
        set((s) => {
          const newPlace = { ...p, id: makeId("pl") };
          if (s.currentUserId) dbInsertPlace(newPlace, s.currentUserId);
          return {
            places: [...s.places, newPlace],
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "timeline" as const, title: "New place added", body: p.name, date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updatePlace: (id, patch) =>
        set((s) => ({ places: s.places.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removePlace: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeletePlace(id);
          return { places: s.places.filter((p) => p.id !== id) };
        }),

      addNote: (n) =>
        set((s) => ({ notes: [...s.notes, { ...n, id: makeId("n") }] })),
      updateNote: (id, patch) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      removeNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addVideo: (v) =>
        set((s) => {
          const newVideo = { ...v, id: makeId("v") };
          if (s.currentUserId) dbInsertVideo(newVideo, s.currentUserId);
          return {
            videos: [...s.videos, newVideo],
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "video" as const, title: "New video added", body: v.title, date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updateVideo: (id, patch) =>
        set((s) => ({ videos: s.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      removeVideo: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteVideo(id);
          return { videos: s.videos.filter((v) => v.id !== id) };
        }),

      addJournalEntry: (j) =>
        set((s) => {
          const newEntry = { ...j, id: makeId("j") };
          if (s.currentUserId) dbInsertJournalEntry(newEntry, s.currentUserId);
          return {
            journal: [...s.journal, newEntry],
            notifications: s.settings.notificationsEnabled
              ? [{ id: makeId("n"), type: "journal" as const, title: "New journal entry", body: j.title || "Untitled entry", date: new Date().toISOString(), read: false }, ...s.notifications]
              : s.notifications,
          };
        }),
      updateJournalEntry: (id, patch) =>
        set((s) => ({ journal: s.journal.map((j) => (j.id === id ? { ...j, ...patch } : j)) })),
      removeJournalEntry: (id) =>
        set((s) => {
          if (s.currentUserId) dbDeleteJournalEntry(id);
          return { journal: s.journal.filter((j) => j.id !== id) };
        }),

      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: makeId("n"), date: new Date().toISOString(), read: false },
            ...s.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      removeNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      recomputeAchievements: (streak) =>
        set((s) => {
          const state = get();
          const photoCount = state.gallery.photos.length;
          const letterCount = state.letters.length;
          const songCount = state.playlist.songs.length;
          const timelineCount = state.timeline.length;
          const quoteCount = state.quotes.length;
          const reasonCount = state.reasons.length;
          const videoCount = state.videos.length;
          const placeCount = state.places.length;
          const journalCount = state.journal.length;
          const bucketComplete =
            state.bucketList.length > 0 && state.bucketList.every((b) => b.completed);

          const updates: Record<string, { progress: number; unlocked: boolean }> = {
            "ach-1": { progress: Math.min(photoCount, 1), unlocked: photoCount >= 1 },
            "ach-2": { progress: photoCount, unlocked: photoCount >= 100 },
            "ach-3": { progress: Math.min(letterCount, 1), unlocked: letterCount >= 1 },
            "ach-4": { progress: Math.min(songCount, 1), unlocked: songCount >= 1 },
            "ach-5": { progress: songCount, unlocked: songCount >= 50 },
            "ach-6": { progress: Math.min(timelineCount, 1), unlocked: timelineCount >= 1 },
            "ach-7": { progress: timelineCount, unlocked: timelineCount >= 10 },
            "ach-8": { progress: Math.min(quoteCount, 1), unlocked: quoteCount >= 1 },
            "ach-9": { progress: reasonCount, unlocked: reasonCount >= 100 },
            "ach-10": { progress: Math.min(videoCount, 1), unlocked: videoCount >= 1 },
            "ach-11": { progress: Math.min(placeCount, 1), unlocked: placeCount >= 1 },
            "ach-12": { progress: placeCount, unlocked: placeCount >= 10 },
            "ach-13": { progress: bucketComplete ? 1 : 0, unlocked: bucketComplete },
            "ach-14": { progress: journalCount, unlocked: journalCount >= 30 },
            "ach-15": { progress: streak, unlocked: streak >= 7 },
            "ach-16": { progress: streak, unlocked: streak >= 30 },
            "ach-17": { progress: streak, unlocked: streak >= 365 },
            "ach-18": { progress: Math.min(journalCount, 1), unlocked: journalCount >= 1 },
          };

          return {
            achievements: s.achievements.map((a) => {
              const u = updates[a.id];
              if (!u) return a;
              const wasUnlocked = a.unlockedAt !== null;
              const newlyUnlocked = u.unlocked && !wasUnlocked;
              return {
                ...a,
                progress: u.progress,
                unlockedAt: u.unlocked
                  ? a.unlockedAt ?? new Date().toISOString()
                  : null,
              };
            }),
          };
        }),

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
          journal: [],
          notifications: [],
          achievements: defaultAchievements,
          loaded: true,
        }),

      // Mark a photo as viewed (called when user opens it in lightbox)
      markPhotoViewed: (id) =>
        set((s) => ({
          gallery: {
            ...s.gallery,
            photos: s.gallery.photos.map((p) =>
              p.id === id ? { ...p, lastViewed: new Date().toISOString() } : p
            ),
          },
        })),

      // Delete photos not viewed in the last `maxAgeDays` days (default 30).
      // Favorites are always kept. Returns counts for UI feedback.
      cleanupOldPhotos: (maxAgeDays = 30) => {
        const state = get();
        const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
        const toDelete: string[] = [];
        const toKeep: typeof state.gallery.photos = [];

        for (const p of state.gallery.photos) {
          // Always keep favorites
          if (p.favorite) {
            toKeep.push(p);
            continue;
          }
          const lastViewed = p.lastViewed ? new Date(p.lastViewed).getTime() : (p.uploadedAt ? new Date(p.uploadedAt).getTime() : 0);
          if (lastViewed < cutoff) {
            toDelete.push(p.id);
            // Also delete the blob from IndexedDB if it's an idb:// URL
            if (p.src.startsWith("idb://")) {
              import("@/lib/indexeddb-storage").then(({ deleteBlob }) => deleteBlob(p.src)).catch(() => {});
            }
          } else {
            toKeep.push(p);
          }
        }

        set({ gallery: { ...state.gallery, photos: toKeep } });
        return { deleted: toDelete.length, remaining: toKeep.length };
      },
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
        journal: s.journal,
        notifications: s.notifications,
        achievements: s.achievements,
        loaded: true,
      }),
    }
  )
);
