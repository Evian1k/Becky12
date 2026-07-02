"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Image as ImageIcon, Music2, Mail, Quote, Calendar, MapPin, Video, BookHeart } from "lucide-react";
import { useContentStore } from "@/lib/content-store";

type Result = {
  id: string;
  type: "photo" | "video" | "song" | "letter" | "quote" | "timeline" | "place" | "journal";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const {
    gallery, videos, playlist, letters, quotes, timeline, places, journal,
  } = useContentStore();

  // Cmd/Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results: Result[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out: Result[] = [];

    gallery.photos.forEach((p) => {
      if (p.caption?.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        out.push({ id: p.id, type: "photo", title: p.caption || "Untitled photo", subtitle: p.category, icon: <ImageIcon size={14} /> });
      }
    });
    videos.forEach((v) => {
      if (v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) {
        out.push({ id: v.id, type: "video", title: v.title, subtitle: "Video", icon: <Video size={14} /> });
      }
    });
    playlist.songs.forEach((s) => {
      if (s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)) {
        out.push({ id: s.id, type: "song", title: s.title, subtitle: s.artist || "Unknown artist", icon: <Music2 size={14} /> });
      }
    });
    letters.forEach((l) => {
      if (l.preview?.toLowerCase().includes(q) || l.body.join(" ").toLowerCase().includes(q) || l.recipient.toLowerCase().includes(q)) {
        out.push({ id: l.id, type: "letter", title: l.preview || `Letter to ${l.recipient}`, subtitle: l.date, icon: <Mail size={14} /> });
      }
    });
    quotes.forEach((qq) => {
      if (qq.text.toLowerCase().includes(q) || qq.author.toLowerCase().includes(q)) {
        out.push({ id: qq.id, type: "quote", title: qq.text.slice(0, 60), subtitle: qq.author || "Unknown", icon: <Quote size={14} /> });
      }
    });
    timeline.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
        out.push({ id: t.id, type: "timeline", title: t.title, subtitle: t.date, icon: <Calendar size={14} /> });
      }
    });
    places.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.story.toLowerCase().includes(q)) {
        out.push({ id: p.id, type: "place", title: p.name, subtitle: p.location, icon: <MapPin size={14} /> });
      }
    });
    journal.forEach((j) => {
      if (j.title.toLowerCase().includes(q) || j.body.toLowerCase().includes(q)) {
        out.push({ id: j.id, type: "journal", title: j.title, subtitle: new Date(j.date).toLocaleDateString(), icon: <BookHeart size={14} /> });
      }
    });

    return out.slice(0, 30);
  }, [query, gallery, videos, playlist, letters, quotes, timeline, places, journal]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="glass hidden h-10 w-10 place-items-center rounded-full text-foreground/80 hover:text-rose-500 sm:grid"
      >
        <Search size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[165] grid place-items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-xl overflow-hidden rounded-3xl"
            >
              <div className="flex items-center gap-3 border-b border-rose-500/15 p-4">
                <Search size={18} className="text-rose-500" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search everything — photos, songs, letters, memories..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => setOpen(false)} className="grid h-7 w-7 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                {query.trim() === "" ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Start typing to search across all your content.
                    <p className="mt-2 text-xs">Photos, videos, songs, letters, quotes, timeline, places, journal.</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No results for "{query}"
                  </div>
                ) : (
                  results.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-rose-500/10"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-500/10 text-rose-500">
                        {r.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{r.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-rose-500/60">{r.type}</span>
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-rose-500/15 p-3 text-center text-[10px] text-muted-foreground">
                Press <kbd className="rounded bg-rose-500/10 px-1.5 py-0.5 text-rose-500">Esc</kbd> to close •
                <kbd className="ml-2 rounded bg-rose-500/10 px-1.5 py-0.5 text-rose-500">⌘K</kbd> to toggle
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
