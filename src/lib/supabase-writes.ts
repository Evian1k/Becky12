"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase-client";
import type {
  Photo, TimelineEvent, LoveLetter, Song, Quote, BucketItem,
  FutureDream, Reason, SpecialDate, Place, Note, Video, JournalEntry,
} from "@/lib/types";

/**
 * Supabase write operations — called from the Zustand store actions.
 * Each function writes the corresponding row to Supabase.
 * If Supabase isn't configured, these are no-ops (LocalStorage handles persistence).
 *
 * The realtime subscriptions in ContentProvider will then broadcast
 * the change to the other partner's device automatically.
 */

export async function dbInsertPhoto(photo: Photo, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("photos").insert({
    id: photo.id,
    user_id: userId,
    src: photo.src,
    caption: photo.caption,
    category: photo.category,
    album: photo.album,
    favorite: photo.favorite || false,
  });
  if (error) console.warn("Failed to sync photo to Supabase:", error.message);
}

export async function dbUpdatePhoto(id: string, patch: Partial<Photo>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("photos").update({
    caption: patch.caption,
    category: patch.category,
    album: patch.album,
    favorite: patch.favorite,
  }).eq("id", id);
  if (error) console.warn("Failed to update photo in Supabase:", error.message);
}

export async function dbDeletePhoto(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) console.warn("Failed to delete photo from Supabase:", error.message);
}

export async function dbInsertVideo(video: Video, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("videos").insert({
    id: video.id,
    user_id: userId,
    src: video.src,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail,
    favorite: video.favorite || false,
  });
  if (error) console.warn("Failed to sync video to Supabase:", error.message);
}

export async function dbDeleteVideo(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) console.warn("Failed to delete video from Supabase:", error.message);
}

export async function dbInsertSong(song: Song, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("songs").insert({
    id: song.id,
    user_id: userId,
    title: song.title,
    artist: song.artist,
    album: song.album,
    duration: song.duration,
    src: song.src,
    cover: song.cover,
    favorite: song.favorite || false,
  });
  if (error) console.warn("Failed to sync song to Supabase:", error.message);
}

export async function dbDeleteSong(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) console.warn("Failed to delete song from Supabase:", error.message);
}

export async function dbInsertLetter(letter: LoveLetter, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("letters").insert({
    id: letter.id,
    user_id: userId,
    recipient: letter.recipient,
    date: letter.date,
    signature: letter.signature,
    preview: letter.preview,
    body: letter.body,
    favorite: letter.favorite || false,
  });
  if (error) console.warn("Failed to sync letter to Supabase:", error.message);
}

export async function dbDeleteLetter(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("letters").delete().eq("id", id);
  if (error) console.warn("Failed to delete letter from Supabase:", error.message);
}

export async function dbInsertQuote(quote: Quote, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("quotes").insert({
    id: quote.id,
    user_id: userId,
    text: quote.text,
    author: quote.author,
    favorite: quote.favorite || false,
    category: quote.category || "",
  });
  if (error) console.warn("Failed to sync quote to Supabase:", error.message);
}

export async function dbDeleteQuote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("quotes").delete().eq("id", id);
  if (error) console.warn("Failed to delete quote from Supabase:", error.message);
}

export async function dbInsertTimelineEvent(event: TimelineEvent, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("timeline_events").insert({
    id: event.id,
    user_id: userId,
    title: event.title,
    date: event.date,
    description: event.description,
    image: event.image,
    emoji: event.emoji,
    location: event.location || "",
    favorite: event.favorite || false,
  });
  if (error) console.warn("Failed to sync timeline event to Supabase:", error.message);
}

export async function dbDeleteTimelineEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("timeline_events").delete().eq("id", id);
  if (error) console.warn("Failed to delete timeline event from Supabase:", error.message);
}

export async function dbInsertJournalEntry(entry: JournalEntry, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("journal_entries").insert({
    id: entry.id,
    user_id: userId,
    date: entry.date,
    mood: entry.mood,
    title: entry.title,
    body: entry.body,
    photos: entry.photos,
  });
  if (error) console.warn("Failed to sync journal entry to Supabase:", error.message);
}

export async function dbDeleteJournalEntry(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) console.warn("Failed to delete journal entry from Supabase:", error.message);
}

export async function dbInsertBucketItem(item: BucketItem, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("bucket_list_items").insert({
    id: item.id,
    user_id: userId,
    title: item.title,
    description: item.description,
    emoji: item.emoji,
    category: item.category,
    completed: item.completed || false,
  });
  if (error) console.warn("Failed to sync bucket item to Supabase:", error.message);
}

export async function dbDeleteBucketItem(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("bucket_list_items").delete().eq("id", id);
  if (error) console.warn("Failed to delete bucket item from Supabase:", error.message);
}

export async function dbInsertPlace(place: Place, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("places").insert({
    id: place.id,
    user_id: userId,
    name: place.name,
    location: place.location,
    story: place.story,
    photos: place.photos,
    visited_date: place.visitedDate,
    lat: place.lat,
    lng: place.lng,
  });
  if (error) console.warn("Failed to sync place to Supabase:", error.message);
}

export async function dbDeletePlace(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) console.warn("Failed to delete place from Supabase:", error.message);
}

export async function dbInsertSpecialDate(date: SpecialDate, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("special_dates").insert({
    id: date.id,
    user_id: userId,
    title: date.title,
    date: date.date,
    emoji: date.emoji,
    description: date.description,
    recurring: date.recurring,
  });
  if (error) console.warn("Failed to sync special date to Supabase:", error.message);
}

export async function dbDeleteSpecialDate(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("special_dates").delete().eq("id", id);
  if (error) console.warn("Failed to delete special date from Supabase:", error.message);
}

export async function dbInsertReason(reason: Reason, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("reasons").insert({
    id: reason.id,
    user_id: userId,
    short: reason.short,
    long: reason.long,
  });
  if (error) console.warn("Failed to sync reason to Supabase:", error.message);
}

export async function dbDeleteReason(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("reasons").delete().eq("id", id);
  if (error) console.warn("Failed to delete reason from Supabase:", error.message);
}

export async function dbInsertDream(dream: FutureDream, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("future_dreams").insert({
    id: dream.id,
    user_id: userId,
    title: dream.title,
    description: dream.description,
    emoji: dream.emoji,
    gradient: dream.gradient,
  });
  if (error) console.warn("Failed to sync dream to Supabase:", error.message);
}

export async function dbDeleteDream(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("future_dreams").delete().eq("id", id);
  if (error) console.warn("Failed to delete dream from Supabase:", error.message);
}

export async function dbInsertNotification(notification: { id: string; type: string; title: string; body: string }, userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("notifications").insert({
    id: notification.id,
    user_id: userId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    read: false,
  });
  if (error) console.warn("Failed to sync notification to Supabase:", error.message);
}
