// Shared types for all content sections. These mirror the JSON files in /public/data.

export type Photo = {
  id: string;
  src: string;
  caption: string;
  category: string;
  album: string;
  favorite?: boolean;
  lastViewed?: string; // ISO date — used for auto-cleanup of old, unviewed photos
  uploadedAt?: string; // ISO date
};

export type GalleryData = {
  photos: Photo[];
  albums: string[];
  categories: string[];
};

export type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  emoji: string;
  location?: string;
  favorite?: boolean;
};

export type LoveLetter = {
  id: string;
  recipient: string;
  date: string;
  signature: string;
  preview: string;
  body: string[];
  favorite?: boolean;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  src: string;
  cover: string;
  favorite?: boolean;
};

export type PlaylistData = {
  songs: Song[];
  ourSongId: string | null;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
  favorite: boolean;
  category?: string;
};

export type BucketItem = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  completed?: boolean;
};

export type FutureDream = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
};

export type MemoryItem =
  | { type: "polaroid"; id: string; src: string; caption: string; rotate: number; top: string; left: string; width: string }
  | { type: "sticky"; id: string; text: string; color: string; rotate: number; top: string; left: string }
  | { type: "doodle"; id: string; emoji: string; rotate: number; top: string; left: string; size: string };

export type Reason = {
  id: string;
  short: string;
  long: string;
};

export type SpecialDate = {
  id: string;
  title: string;
  date: string;
  emoji: string;
  description: string;
  recurring: boolean;
};

export type Place = {
  id: string;
  name: string;
  location: string;
  story: string;
  photos: string[];
  visitedDate: string;
  lat?: number;
  lng?: number;
};

export type Note = {
  id: string;
  text: string;
  category: "love" | "journal" | "future" | "dream";
  date: string;
};

export type Video = {
  id: string;
  src: string;
  title: string;
  description: string;
  thumbnail: string;
  favorite?: boolean;
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: "happy" | "love" | "calm" | "excited" | "tired" | "sad" | "grateful" | "neutral";
  title: string;
  body: string;
  photos: string[];
  authorId?: string;
};

export type Notification = {
  id: string;
  type: "photo" | "video" | "song" | "letter" | "quote" | "journal" | "timeline" | "anniversary" | "birthday" | "streak" | "achievement";
  title: string;
  body: string;
  date: string;
  read: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt: string | null;
  progress?: number;
  target?: number;
};

export type Settings = {
  title: string;
  subtitle: string;
  partner1: string;
  partner2: string;
  anniversaryDate: string;
  madeBy: string;
  finalMessage: string;
  accentColor: string;
  heroPhotos: { id: string; src: string; caption: string }[];
  themeColor: string;
  animationsEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  floatingHeartsEnabled: boolean;
  particlesEnabled: boolean;
};
