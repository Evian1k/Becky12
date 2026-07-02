"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase-client";
import type {
  Photo, GalleryData, TimelineEvent, LoveLetter, Song, PlaylistData,
  Quote, BucketItem, FutureDream, Reason, SpecialDate, Place, Note,
  Video, JournalEntry, Notification, Settings,
} from "@/lib/types";

/**
 * Supabase data layer — loads and syncs content from the database when
 * Supabase is configured. Falls back gracefully (returns null) when not.
 *
 * Each `load*` function returns the data or null. Each `subscribe*` function
 * sets up a realtime subscription and returns an unsubscribe callback.
 */

// ---------- Mappers (DB row → app type) ----------

function mapPhoto(r: any): Photo {
  return {
    id: r.id,
    src: r.src,
    caption: r.caption || "",
    category: r.category || "Selfies",
    album: r.album || "Default",
    favorite: r.favorite || false,
  };
}

function mapTimelineEvent(r: any): TimelineEvent {
  return {
    id: r.id,
    title: r.title,
    date: r.date || new Date().toISOString(),
    description: r.description || "",
    image: r.image || "",
    emoji: r.emoji || "❤️",
    location: r.location || "",
    favorite: r.favorite || false,
  };
}

function mapLetter(r: any): LoveLetter {
  return {
    id: r.id,
    recipient: r.recipient || "",
    date: r.date || "",
    signature: r.signature || "",
    preview: r.preview || "",
    body: Array.isArray(r.body) ? r.body : [],
    favorite: r.favorite || false,
  };
}

function mapSong(r: any): Song {
  return {
    id: r.id,
    title: r.title,
    artist: r.artist || "",
    album: r.album || "",
    duration: r.duration || "",
    src: r.src,
    cover: r.cover || "",
    favorite: r.favorite || false,
  };
}

function mapQuote(r: any): Quote {
  return {
    id: r.id,
    text: r.text,
    author: r.author || "",
    favorite: r.favorite || false,
    category: r.category || "",
  };
}

function mapBucketItem(r: any): BucketItem {
  return {
    id: r.id,
    title: r.title,
    description: r.description || "",
    emoji: r.emoji || "❤️",
    category: r.category || "",
    completed: r.completed || false,
  };
}

function mapFutureDream(r: any): FutureDream {
  return {
    id: r.id,
    title: r.title,
    description: r.description || "",
    emoji: r.emoji || "✨",
    gradient: r.gradient || "from-rose-400/30 to-pink-500/30",
  };
}

function mapReason(r: any): Reason {
  return {
    id: r.id,
    short: r.short,
    long: r.long || "",
  };
}

function mapSpecialDate(r: any): SpecialDate {
  return {
    id: r.id,
    title: r.title,
    date: r.date || new Date().toISOString().slice(0, 10),
    emoji: r.emoji || "⭐",
    description: r.description || "",
    recurring: r.recurring !== false,
  };
}

function mapPlace(r: any): Place {
  return {
    id: r.id,
    name: r.name,
    location: r.location || "",
    story: r.story || "",
    photos: Array.isArray(r.photos) ? r.photos : [],
    visitedDate: r.visited_date || new Date().toISOString().slice(0, 10),
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
  };
}

function mapVideo(r: any): Video {
  return {
    id: r.id,
    src: r.src,
    title: r.title,
    description: r.description || "",
    thumbnail: r.thumbnail || "",
    favorite: r.favorite || false,
  };
}

function mapJournal(r: any): JournalEntry {
  return {
    id: r.id,
    date: r.date || new Date().toISOString(),
    mood: r.mood || "neutral",
    title: r.title || "",
    body: r.body || "",
    photos: Array.isArray(r.photos) ? r.photos : [],
    authorId: r.user_id,
  };
}

function mapNotification(r: any): Notification {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body || "",
    date: r.created_at || new Date().toISOString(),
    read: r.read || false,
  };
}

function mapSettings(r: any): Settings {
  return {
    title: r.title || "Our Forever",
    subtitle: r.subtitle || "Our story is still being written...",
    partner1: r.partner1 || "",
    partner2: r.partner2 || "",
    anniversaryDate: r.anniversary_date || "",
    madeBy: r.made_by || "Made with ❤️",
    finalMessage: r.final_message || "",
    accentColor: r.accent_color || "#ff4d6d",
    heroPhotos: Array.isArray(r.hero_photos) ? r.hero_photos : [],
    themeColor: r.theme_color || "#ff4d6d",
    animationsEnabled: r.animations_enabled !== false,
    musicEnabled: r.music_enabled !== false,
    notificationsEnabled: r.notifications_enabled !== false,
    floatingHeartsEnabled: r.floating_hearts_enabled !== false,
    particlesEnabled: r.particles_enabled !== false,
  };
}

// ---------- Loaders ----------

export async function loadAllFromSupabase(): Promise<Partial<{
  gallery: GalleryData;
  timeline: TimelineEvent[];
  letters: LoveLetter[];
  playlist: PlaylistData;
  quotes: Quote[];
  bucketList: BucketItem[];
  futureDreams: FutureDream[];
  reasons: Reason[];
  specialDates: SpecialDate[];
  places: Place[];
  notes: Note[];
  videos: Video[];
  journal: JournalEntry[];
  notifications: Notification[];
  settings: Settings;
}> | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const [
    photosRes, videosRes, songsRes, lettersRes, quotesRes,
    timelineRes, journalRes, bucketRes, placesRes, specialDatesRes,
    reasonsRes, dreamsRes, notesRes, notificationsRes, settingsRes,
  ] = await Promise.all([
    supabase.from("photos").select("*").order("created_at", { ascending: false }),
    supabase.from("videos").select("*").order("created_at", { ascending: false }),
    supabase.from("songs").select("*").order("created_at", { ascending: false }),
    supabase.from("letters").select("*").order("created_at", { ascending: false }),
    supabase.from("quotes").select("*").order("created_at", { ascending: false }),
    supabase.from("timeline_events").select("*").order("date", { ascending: false }),
    supabase.from("journal_entries").select("*").order("date", { ascending: false }),
    supabase.from("bucket_list_items").select("*").order("created_at", { ascending: false }),
    supabase.from("places").select("*").order("visited_date", { ascending: false }),
    supabase.from("special_dates").select("*").order("date", { ascending: true }),
    supabase.from("reasons").select("*").order("created_at", { ascending: false }),
    supabase.from("future_dreams").select("*").order("created_at", { ascending: false }),
    supabase.from("notes").select("*").order("date", { ascending: false }),
    supabase.from("notifications").select("*").order("created_at", { ascending: false }),
    supabase.from("settings").select("*").limit(1),
  ]);

  const settingsRow = settingsRes.data?.[0];

  return {
    gallery: {
      photos: (photosRes.data || []).map(mapPhoto),
      albums: Array.from(new Set((photosRes.data || []).map((p: any) => p.album || "Default"))),
      categories: ["Selfies", "Adventures", "Funny Moments", "Dates", "Random"],
    },
    videos: (videosRes.data || []).map(mapVideo),
    playlist: {
      songs: (songsRes.data || []).map(mapSong),
      ourSongId: null, // TODO: store in settings
    },
    letters: (lettersRes.data || []).map(mapLetter),
    quotes: (quotesRes.data || []).map(mapQuote),
    timeline: (timelineRes.data || []).map(mapTimelineEvent),
    journal: (journalRes.data || []).map(mapJournal),
    bucketList: (bucketRes.data || []).map(mapBucketItem),
    places: (placesRes.data || []).map(mapPlace),
    specialDates: (specialDatesRes.data || []).map(mapSpecialDate),
    reasons: (reasonsRes.data || []).map(mapReason),
    futureDreams: (dreamsRes.data || []).map(mapFutureDream),
    notes: (notesRes.data || []).map((r: any) => ({
      id: r.id,
      text: r.text,
      category: r.category || "love",
      date: r.date || new Date().toISOString(),
    })),
    notifications: (notificationsRes.data || []).map(mapNotification),
    settings: settingsRow ? mapSettings(settingsRow) : undefined,
  };
}

// ---------- Realtime subscriptions ----------

type TableHandler = (payload: { eventType: "INSERT" | "UPDATE" | "DELETE"; new: any; old: any }) => void;

export function subscribeToTable(table: string, handler: TableHandler): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};
  const channel = supabase
    .channel(`realtime-${table}`)
    .on("postgres_changes", { event: "*", schema: "public", table }, (payload: any) => {
      handler({
        eventType: payload.eventType as any,
        new: payload.new,
        old: payload.old,
      });
    })
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// ---------- Storage uploads ----------

/**
 * Uploads a file to Supabase Storage. Returns the public URL.
 * Falls back to URL.createObjectURL if Supabase isn't configured.
 */
export async function uploadToStorage(file: File | Blob, folder: string): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    return URL.createObjectURL(file);
  }
  const ext = file.type.split("/")[1] || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    console.warn("Storage upload failed, falling back to blob URL:", error.message);
    return URL.createObjectURL(file);
  }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
