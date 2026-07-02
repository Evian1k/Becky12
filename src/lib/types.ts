// Shared types for all content sections. These mirror the JSON files in /public/data.

export type Photo = {
  id: string;
  src: string;
  caption: string;
  category: string;
  album: string;
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
};

export type LoveLetter = {
  id: string;
  recipient: string;
  date: string;
  signature: string;
  preview: string;
  body: string[];
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  src: string;
  cover: string;
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
};

export type BucketItem = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
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
};
