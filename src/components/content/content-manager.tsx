"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  X, Plus, Trash2, Edit2, Save, Heart, Music2, Mail, Quote as QuoteIcon,
  Calendar, MapPin, StickyNote, Target, Sparkles, Video, Image as ImageIcon,
  Settings as SettingsIcon, Star, Upload, GripVertical, ChevronUp, ChevronDown,
} from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { uploadToStorage } from "@/lib/supabase-data";
import { useResolvedSrc } from "@/hooks/use-resolved-src";
import { PhotoManager } from "./photo-manager";
import { cn } from "@/lib/utils";

type Tab =
  | "photos"
  | "videos"
  | "songs"
  | "letters"
  | "quotes"
  | "timeline"
  | "notes"
  | "bucket-list"
  | "special-dates"
  | "places"
  | "future-dreams"
  | "reasons"
  | "settings";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Video },
  { id: "songs", label: "Songs", icon: Music2 },
  { id: "letters", label: "Letters", icon: Mail },
  { id: "quotes", label: "Quotes", icon: QuoteIcon },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "bucket-list", label: "Bucket List", icon: Target },
  { id: "special-dates", label: "Special Dates", icon: Calendar },
  { id: "places", label: "Places", icon: MapPin },
  { id: "future-dreams", label: "Future Dreams", icon: Sparkles },
  { id: "reasons", label: "Reasons", icon: Heart },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

// Reusable small input
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500 custom-scrollbar"
      />
    </label>
  );
}

function ItemCard({
  children,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="relative rounded-2xl border border-rose-500/15 bg-background/40 p-4">
      <div className="absolute right-2 top-2 flex gap-1">
        {onMoveUp && (
          <button
            onClick={onMoveUp}
            aria-label="Move up"
            className="grid h-6 w-6 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          >
            <ChevronUp size={12} />
          </button>
        )}
        {onMoveDown && (
          <button
            onClick={onMoveDown}
            aria-label="Move down"
            className="grid h-6 w-6 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          >
            <ChevronDown size={12} />
          </button>
        )}
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="grid h-6 w-6 place-items-center rounded-full bg-red-500/80 text-white hover:bg-red-600"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {children}
    </div>
  );
}

function EmptyTab({ icon: Icon, label, hint }: { icon: React.ElementType; label: string; hint: string }) {
  return (
    <div className="grid place-items-center py-16 text-center">
      <Icon size={32} className="mb-3 text-rose-500/40" />
      <p className="text-sm font-medium">No {label} yet</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ContentManager({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("photos");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[170] grid place-items-stretch sm:place-items-center bg-black/70 p-0 backdrop-blur-xl sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong flex h-[100vh] w-full max-w-5xl flex-col overflow-hidden rounded-none sm:h-[92vh] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-500/15 px-4 py-3 sm:px-6">
          <div>
            <h2 className="font-serif-display text-xl font-bold sm:text-2xl">Content Manager</h2>
            <p className="text-[10px] uppercase tracking-wider text-rose-500/70">
              Edit everything — saved automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body: tabs + content */}
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Tabs sidebar */}
          <div className="flex shrink-0 overflow-x-auto border-b border-rose-500/15 md:flex-col md:overflow-y-auto md:border-b-0 md:border-r custom-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors md:px-4 md:text-sm",
                  tab === t.id
                    ? "bg-gradient-to-r from-rose-500/20 to-transparent text-rose-500 md:border-l-2 md:border-rose-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon size={14} />
                <span className="whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tab === "photos" && <PhotoManager onClose={() => {}} />}
                {tab !== "photos" && <TabContent tab={tab} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  // Each sub-component below reads from / writes to the Zustand store.
  switch (tab) {
    case "videos":
      return <VideosTab />;
    case "songs":
      return <SongsTab />;
    case "letters":
      return <LettersTab />;
    case "quotes":
      return <QuotesTab />;
    case "timeline":
      return <TimelineTab />;
    case "notes":
      return <NotesTab />;
    case "bucket-list":
      return <BucketListTab />;
    case "special-dates":
      return <SpecialDatesTab />;
    case "places":
      return <PlacesTab />;
    case "future-dreams":
      return <FutureDreamsTab />;
    case "reasons":
      return <ReasonsTab />;
    case "settings":
      return <SettingsTab />;
    default:
      return null;
  }
}

/* ---------------- Videos ---------------- */
function VideosTab() {
  const videos = useContentStore((s) => s.videos);
  const addVideo = useContentStore((s) => s.addVideo);
  const updateVideo = useContentStore((s) => s.updateVideo);
  const removeVideo = useContentStore((s) => s.removeVideo);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      for (const file of Array.from(files).filter((f) => f.type.startsWith("video/"))) {
        const url = await uploadToStorage(file, "videos");
        const video = document.createElement("video");
        video.src = url;
        video.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          video.addEventListener("loadeddata", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 180;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            addVideo({
              src: url,
              title: file.name.replace(/\.[^.]+$/, ""),
              description: "",
              thumbnail: canvas.toDataURL("image/jpeg", 0.7),
            });
            resolve();
          });
          video.addEventListener("error", () => {
            addVideo({
              src: url,
              title: file.name.replace(/\.[^.]+$/, ""),
              description: "",
              thumbnail: "",
            });
            resolve();
          });
        });
      }
    },
    [addVideo]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Videos</h3>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Video
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {videos.length === 0 ? (
        <EmptyTab icon={Video} label="videos" hint="Add MP4 / WebM files from your device" />
      ) : (
        <div className="grid gap-3">
          {videos.map((v, i) => (
            <ItemCard
              key={v.id}
              onRemove={() => removeVideo(v.id)}
              onMoveUp={i > 0 ? () => updateVideo(v.id, {} as any) : undefined}
              onMoveDown={i < videos.length - 1 ? () => updateVideo(v.id, {} as any) : undefined}
            >
              <div className="flex gap-3 pr-12">
                {v.thumbnail && (
                  <VideoThumb src={v.src} poster={v.thumbnail} />
                )}
                <div className="flex-1 space-y-2">
                  <Field label="Title" value={v.title} onChange={(val) => updateVideo(v.id, { title: val })} />
                  <Field label="Description" value={v.description} onChange={(val) => updateVideo(v.id, { description: val })} />
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Songs ---------------- */
function SongsTab() {
  const playlist = useContentStore((s) => s.playlist);
  const addSong = useContentStore((s) => s.addSong);
  const updateSong = useContentStore((s) => s.updateSong);
  const removeSong = useContentStore((s) => s.removeSong);
  const setOurSong = useContentStore((s) => s.setOurSong);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      for (const file of Array.from(files).filter((f) => f.type.startsWith("audio/"))) {
        const url = await uploadToStorage(file, "songs");
        const audio = document.createElement("audio");
        audio.src = url;
        audio.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          audio.addEventListener("loadedmetadata", () => {
            const m = Math.floor(audio.duration / 60);
            const s = Math.floor(audio.duration % 60);
            addSong({
              title: file.name.replace(/\.[^.]+$/, ""),
              artist: "",
              album: "",
              duration: `${m}:${s.toString().padStart(2, "0")}`,
              src: url,
              cover: "",
            });
            resolve();
          });
          audio.addEventListener("error", () => {
            addSong({
              title: file.name.replace(/\.[^.]+$/, ""),
              artist: "",
              album: "",
              duration: "",
              src: url,
              cover: "",
            });
            resolve();
          });
        });
      }
    },
    [addSong]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Songs</h3>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add MP3
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {playlist.songs.length === 0 ? (
        <EmptyTab icon={Music2} label="songs" hint="Upload MP3 files to build your playlist" />
      ) : (
        <div className="grid gap-3">
          {playlist.songs.map((s) => (
            <ItemCard key={s.id} onRemove={() => removeSong(s.id)}>
              <div className="space-y-2 pr-12">
                <div className="flex items-center gap-2">
                  <Field label="Title" value={s.title} onChange={(v) => updateSong(s.id, { title: v })} />
                  <button
                    onClick={() => setOurSong(playlist.ourSongId === s.id ? null : s.id)}
                    className={cn(
                      "mt-5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                      playlist.ourSongId === s.id
                        ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow"
                        : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                    )}
                    aria-label="Mark as our song"
                    title="Mark as 'Our Song'"
                  >
                    <Heart size={14} fill="currentColor" strokeWidth={0} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Artist" value={s.artist} onChange={(v) => updateSong(s.id, { artist: v })} />
                  <Field label="Album" value={s.album} onChange={(v) => updateSong(s.id, { album: v })} />
                </div>
                <Field label="Cover image URL" value={s.cover} onChange={(v) => updateSong(s.id, { cover: v })} placeholder="/gallery/..." />
                {playlist.ourSongId === s.id && (
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-rose-500">
                    <Star size={10} fill="currentColor" /> Our Song
                  </p>
                )}
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Letters ---------------- */
function LettersTab() {
  const letters = useContentStore((s) => s.letters);
  const addLetter = useContentStore((s) => s.addLetter);
  const updateLetter = useContentStore((s) => s.updateLetter);
  const removeLetter = useContentStore((s) => s.removeLetter);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Love Letters</h3>
        <button
          onClick={() =>
            addLetter({
              recipient: "My love,",
              date: new Date().toLocaleDateString(),
              signature: "Forever yours,",
              preview: "",
              body: [""],
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> New Letter
        </button>
      </div>
      {letters.length === 0 ? (
        <EmptyTab icon={Mail} label="letters" hint="Write your first love letter" />
      ) : (
        <div className="grid gap-3">
          {letters.map((l) => (
            <ItemCard key={l.id} onRemove={() => removeLetter(l.id)}>
              <div className="space-y-2 pr-12">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Recipient" value={l.recipient} onChange={(v) => updateLetter(l.id, { recipient: v })} />
                  <Field label="Date" value={l.date} onChange={(v) => updateLetter(l.id, { date: v })} />
                </div>
                <Field label="Signature" value={l.signature} onChange={(v) => updateLetter(l.id, { signature: v })} />
                <Field label="Preview" value={l.preview} onChange={(v) => updateLetter(l.id, { preview: v })} />
                <TextArea
                  label="Body (one paragraph per line)"
                  value={l.body.join("\n")}
                  onChange={(v) => updateLetter(l.id, { body: v.split("\n") })}
                  rows={6}
                />
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Quotes ---------------- */
function QuotesTab() {
  const quotes = useContentStore((s) => s.quotes);
  const addQuote = useContentStore((s) => s.addQuote);
  const updateQuote = useContentStore((s) => s.updateQuote);
  const removeQuote = useContentStore((s) => s.removeQuote);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Quotes</h3>
        <button
          onClick={() => addQuote({ text: "", author: "", favorite: false })}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Quote
        </button>
      </div>
      {quotes.length === 0 ? (
        <EmptyTab icon={QuoteIcon} label="quotes" hint="Add romantic quotes that mean something to you" />
      ) : (
        <div className="grid gap-3">
          {quotes.map((q) => (
            <ItemCard key={q.id} onRemove={() => removeQuote(q.id)}>
              <div className="space-y-2 pr-12">
                <TextArea label="Quote" value={q.text} onChange={(v) => updateQuote(q.id, { text: v })} rows={2} />
                <div className="flex items-end gap-2">
                  <Field label="Author" value={q.author} onChange={(v) => updateQuote(q.id, { author: v })} />
                  <button
                    onClick={() => updateQuote(q.id, { favorite: !q.favorite })}
                    className={cn(
                      "mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                      q.favorite
                        ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white"
                        : "bg-rose-500/10 text-rose-500"
                    )}
                    aria-label="Favorite"
                  >
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                  </button>
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Timeline ---------------- */
function TimelineTab() {
  const timeline = useContentStore((s) => s.timeline);
  const addTimelineEvent = useContentStore((s) => s.addTimelineEvent);
  const updateTimelineEvent = useContentStore((s) => s.updateTimelineEvent);
  const removeTimelineEvent = useContentStore((s) => s.removeTimelineEvent);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Timeline Events</h3>
        <button
          onClick={() =>
            addTimelineEvent({
              title: "",
              date: new Date().toISOString(),
              description: "",
              image: "",
              emoji: "❤️",
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Event
        </button>
      </div>
      {timeline.length === 0 ? (
        <EmptyTab icon={Calendar} label="events" hint="Add your first memory, first date, first kiss..." />
      ) : (
        <div className="grid gap-3">
          {timeline.map((e) => (
            <ItemCard key={e.id} onRemove={() => removeTimelineEvent(e.id)}>
              <div className="space-y-2 pr-12">
                <div className="grid grid-cols-[60px_1fr] gap-2">
                  <Field label="Emoji" value={e.emoji} onChange={(v) => updateTimelineEvent(e.id, { emoji: v })} />
                  <Field label="Title" value={e.title} onChange={(v) => updateTimelineEvent(e.id, { title: v })} />
                </div>
                <Field
                  label="Date"
                  type="datetime-local"
                  value={e.date.slice(0, 16)}
                  onChange={(v) => updateTimelineEvent(e.id, { date: new Date(v).toISOString() })}
                />
                <Field
                  label="Image URL"
                  value={e.image}
                  onChange={(v) => updateTimelineEvent(e.id, { image: v })}
                  placeholder="/gallery/..."
                />
                <TextArea label="Description" value={e.description} onChange={(v) => updateTimelineEvent(e.id, { description: v })} />
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Notes ---------------- */
function NotesTab() {
  const notes = useContentStore((s) => s.notes);
  const addNote = useContentStore((s) => s.addNote);
  const updateNote = useContentStore((s) => s.updateNote);
  const removeNote = useContentStore((s) => s.removeNote);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Notes</h3>
        <button
          onClick={() =>
            addNote({
              text: "",
              category: "love",
              date: new Date().toISOString(),
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Note
        </button>
      </div>
      {notes.length === 0 ? (
        <EmptyTab icon={StickyNote} label="notes" hint="Quick love notes, journal entries, future plans" />
      ) : (
        <div className="grid gap-3">
          {notes.map((n) => (
            <ItemCard key={n.id} onRemove={() => removeNote(n.id)}>
              <div className="space-y-2 pr-12">
                <TextArea label="Note" value={n.text} onChange={(v) => updateNote(n.id, { text: v })} rows={3} />
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Category
                  </span>
                  <select
                    value={n.category}
                    onChange={(e) => updateNote(n.id, { category: e.target.value as any })}
                    className="w-full rounded-lg border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
                  >
                    <option value="love">Love Note</option>
                    <option value="journal">Journal</option>
                    <option value="future">Future Plan</option>
                    <option value="dream">Dream</option>
                  </select>
                </label>
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Bucket List ---------------- */
function BucketListTab() {
  const bucketList = useContentStore((s) => s.bucketList);
  const addBucketItem = useContentStore((s) => s.addBucketItem);
  const updateBucketItem = useContentStore((s) => s.updateBucketItem);
  const removeBucketItem = useContentStore((s) => s.removeBucketItem);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Bucket List</h3>
        <button
          onClick={() =>
            addBucketItem({
              title: "",
              description: "",
              emoji: "❤️",
              category: "Adventure",
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Goal
        </button>
      </div>
      {bucketList.length === 0 ? (
        <EmptyTab icon={Target} label="bucket list items" hint="Add dreams and goals to chase together" />
      ) : (
        <div className="grid gap-3">
          {bucketList.map((b) => (
            <ItemCard key={b.id} onRemove={() => removeBucketItem(b.id)}>
              <div className="space-y-2 pr-12">
                <div className="grid grid-cols-[60px_1fr] gap-2">
                  <Field label="Emoji" value={b.emoji} onChange={(v) => updateBucketItem(b.id, { emoji: v })} />
                  <Field label="Title" value={b.title} onChange={(v) => updateBucketItem(b.id, { title: v })} />
                </div>
                <Field label="Category" value={b.category} onChange={(v) => updateBucketItem(b.id, { category: v })} />
                <TextArea label="Description" value={b.description} onChange={(v) => updateBucketItem(b.id, { description: v })} />
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Special Dates ---------------- */
function SpecialDatesTab() {
  const specialDates = useContentStore((s) => s.specialDates);
  const addSpecialDate = useContentStore((s) => s.addSpecialDate);
  const updateSpecialDate = useContentStore((s) => s.updateSpecialDate);
  const removeSpecialDate = useContentStore((s) => s.removeSpecialDate);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Special Dates</h3>
        <button
          onClick={() =>
            addSpecialDate({
              title: "",
              date: new Date().toISOString().slice(0, 10),
              emoji: "🎂",
              description: "",
              recurring: true,
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Date
        </button>
      </div>
      {specialDates.length === 0 ? (
        <EmptyTab icon={Calendar} label="special dates" hint="Birthdays, anniversaries, first date, first kiss..." />
      ) : (
        <div className="grid gap-3">
          {specialDates.map((d) => (
            <ItemCard key={d.id} onRemove={() => removeSpecialDate(d.id)}>
              <div className="space-y-2 pr-12">
                <div className="grid grid-cols-[60px_1fr_140px] gap-2">
                  <Field label="Emoji" value={d.emoji} onChange={(v) => updateSpecialDate(d.id, { emoji: v })} />
                  <Field label="Title" value={d.title} onChange={(v) => updateSpecialDate(d.id, { title: v })} />
                  <Field
                    label="Date"
                    type="date"
                    value={d.date}
                    onChange={(v) => updateSpecialDate(d.id, { date: v })}
                  />
                </div>
                <TextArea label="Description" value={d.description} onChange={(v) => updateSpecialDate(d.id, { description: v })} />
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={d.recurring}
                    onChange={(e) => updateSpecialDate(d.id, { recurring: e.target.checked })}
                    className="accent-rose-500"
                  />
                  Recurs every year
                </label>
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Places ---------------- */
function PlacesTab() {
  const places = useContentStore((s) => s.places);
  const addPlace = useContentStore((s) => s.addPlace);
  const updatePlace = useContentStore((s) => s.updatePlace);
  const removePlace = useContentStore((s) => s.removePlace);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Places</h3>
        <button
          onClick={() =>
            addPlace({
              name: "",
              location: "",
              story: "",
              photos: [],
              visitedDate: new Date().toISOString().slice(0, 10),
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Place
        </button>
      </div>
      {places.length === 0 ? (
        <EmptyTab icon={MapPin} label="places" hint="Add places you've visited together" />
      ) : (
        <div className="grid gap-3">
          {places.map((p) => (
            <ItemCard key={p.id} onRemove={() => removePlace(p.id)}>
              <div className="space-y-2 pr-12">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Name" value={p.name} onChange={(v) => updatePlace(p.id, { name: v })} />
                  <Field label="Location" value={p.location} onChange={(v) => updatePlace(p.id, { location: v })} />
                </div>
                <Field
                  label="Visited date"
                  type="date"
                  value={p.visitedDate}
                  onChange={(v) => updatePlace(p.id, { visitedDate: v })}
                />
                <TextArea label="Story" value={p.story} onChange={(v) => updatePlace(p.id, { story: v })} />
                <Field
                  label="Photos (comma-separated URLs)"
                  value={p.photos.join(", ")}
                  onChange={(v) => updatePlace(p.id, { photos: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Future Dreams ---------------- */
function FutureDreamsTab() {
  const futureDreams = useContentStore((s) => s.futureDreams);
  const addDream = useContentStore((s) => s.addDream);
  const updateDream = useContentStore((s) => s.updateDream);
  const removeDream = useContentStore((s) => s.removeDream);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Future Dreams</h3>
        <button
          onClick={() =>
            addDream({
              title: "",
              description: "",
              emoji: "✨",
              gradient: "from-rose-400/30 to-pink-500/30",
            })
          }
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Dream
        </button>
      </div>
      {futureDreams.length === 0 ? (
        <EmptyTab icon={Sparkles} label="dreams" hint="Add dreams you want to build together" />
      ) : (
        <div className="grid gap-3">
          {futureDreams.map((d) => (
            <ItemCard key={d.id} onRemove={() => removeDream(d.id)}>
              <div className="space-y-2 pr-12">
                <div className="grid grid-cols-[60px_1fr] gap-2">
                  <Field label="Emoji" value={d.emoji} onChange={(v) => updateDream(d.id, { emoji: v })} />
                  <Field label="Title" value={d.title} onChange={(v) => updateDream(d.id, { title: v })} />
                </div>
                <Field label="Gradient (Tailwind classes)" value={d.gradient} onChange={(v) => updateDream(d.id, { gradient: v })} />
                <TextArea label="Description" value={d.description} onChange={(v) => updateDream(d.id, { description: v })} />
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Reasons ---------------- */
function ReasonsTab() {
  const reasons = useContentStore((s) => s.reasons);
  const addReason = useContentStore((s) => s.addReason);
  const updateReason = useContentStore((s) => s.updateReason);
  const removeReason = useContentStore((s) => s.removeReason);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-display text-xl font-bold">Reasons I Love You</h3>
        <button
          onClick={() => addReason({ short: "", long: "" })}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Reason
        </button>
      </div>
      {reasons.length === 0 ? (
        <EmptyTab icon={Heart} label="reasons" hint="Add reasons why you love them — short + long version" />
      ) : (
        <div className="grid gap-3">
          {reasons.map((r) => (
            <ItemCard key={r.id} onRemove={() => removeReason(r.id)}>
              <div className="space-y-2 pr-12">
                <Field label="Short (front of card)" value={r.short} onChange={(v) => updateReason(r.id, { short: v })} />
                <TextArea label="Long (back of card)" value={r.long} onChange={(v) => updateReason(r.id, { long: v })} rows={4} />
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsTab() {
  const settings = useContentStore((s) => s.settings);
  const setSettings = useContentStore((s) => s.setSettings);
  const resetAll = useContentStore((s) => s.resetAll);

  return (
    <div>
      <h3 className="mb-4 font-serif-display text-xl font-bold">Settings</h3>
      <div className="grid gap-3">
        <ItemCard onRemove={() => {}}>
          <div className="space-y-2 pr-12">
            <Field label="Site Title" value={settings.title} onChange={(v) => setSettings({ title: v })} />
            <Field label="Subtitle" value={settings.subtitle} onChange={(v) => setSettings({ subtitle: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Partner 1 Name" value={settings.partner1} onChange={(v) => setSettings({ partner1: v })} placeholder="Your name" />
              <Field label="Partner 2 Name" value={settings.partner2} onChange={(v) => setSettings({ partner2: v })} placeholder="Their name" />
            </div>
            <Field
              label="Anniversary Date"
              type="datetime-local"
              value={settings.anniversaryDate ? settings.anniversaryDate.slice(0, 16) : ""}
              onChange={(v) => setSettings({ anniversaryDate: v ? new Date(v).toISOString() : "" })}
            />
            <Field label="Made By (footer)" value={settings.madeBy} onChange={(v) => setSettings({ madeBy: v })} />
            <TextArea label="Final Message (footer)" value={settings.finalMessage} onChange={(v) => setSettings({ finalMessage: v })} rows={3} />
            <Field label="Accent Color" value={settings.accentColor} onChange={(v) => setSettings({ accentColor: v })} />
          </div>
        </ItemCard>

        <ItemCard onRemove={() => {}}>
          <div className="space-y-2 pr-12">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Reset All Content</p>
            <p className="text-xs text-muted-foreground">
              This will clear everything from this session (LocalStorage) and restore the initial empty state.
            </p>
            <button
              onClick={() => {
                if (confirm("Reset all content? This cannot be undone.")) resetAll();
              }}
              className="rounded-full bg-red-500/80 px-4 py-2 text-xs font-medium text-white hover:bg-red-600"
            >
              Reset Everything
            </button>
          </div>
        </ItemCard>
      </div>
    </div>
  );
}

function VideoThumb({ src, poster }: { src: string; poster: string }) {
  const resolvedSrc = useResolvedSrc(src);
  const resolvedPoster = useResolvedSrc(poster);
  if (!resolvedSrc) return <div className="h-16 w-24 rounded-lg bg-rose-500/10" />;
  return (
    <video
      src={resolvedSrc}
      poster={resolvedPoster || undefined}
      className="h-16 w-24 rounded-lg object-cover"
      muted
    />
  );
}
