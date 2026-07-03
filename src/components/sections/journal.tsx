"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookHeart, Plus, Trash2, Calendar, Search, X, Smile } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

const moods = [
  { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-400/30 to-amber-500/30" },
  { id: "love", emoji: "🥰", label: "In Love", color: "from-rose-400/30 to-pink-500/30" },
  { id: "calm", emoji: "😌", label: "Calm", color: "from-sky-400/30 to-blue-500/30" },
  { id: "excited", emoji: "🤩", label: "Excited", color: "from-orange-400/30 to-red-500/30" },
  { id: "tired", emoji: "😴", label: "Tired", color: "from-slate-400/30 to-gray-500/30" },
  { id: "sad", emoji: "😢", label: "Sad", color: "from-blue-400/30 to-indigo-500/30" },
  { id: "grateful", emoji: "🙏", label: "Grateful", color: "from-emerald-400/30 to-teal-500/30" },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "from-gray-400/30 to-slate-500/30" },
] as const;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch { return ""; }
}

export function Journal({ onOpenManager }: { onOpenManager: () => void }) {
  const journal = useContentStore((s) => s.journal);
  const addJournalEntry = useContentStore((s) => s.addJournalEntry);
  const removeJournalEntry = useContentStore((s) => s.removeJournalEntry);
  const [composing, setComposing] = useState(false);
  const [search, setSearch] = useState("");
  const [newEntry, setNewEntry] = useState({
    mood: "love" as const,
    title: "",
    body: "",
  });

  const filtered = journal.filter(
    (e) =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase())
  );

  const submit = () => {
    if (!newEntry.title.trim() && !newEntry.body.trim()) return;
    addJournalEntry({
      date: new Date().toISOString(),
      mood: newEntry.mood,
      title: newEntry.title || "Untitled",
      body: newEntry.body,
      photos: [],
    });
    setNewEntry({ mood: "love", title: "", body: "" });
    setComposing(false);
  };

  return (
    <SectionWrapper id="journal">
      <SectionHeading
        eyebrow="Daily Reflections"
        title={<>Our <span className="text-gradient-romantic">Journal</span></>}
        subtitle="A quiet place to write down how we felt, what we did, who we were."
      />

      {journal.length === 0 && !composing ? (
        <div className="mt-10">
          <EmptyState
            title="No journal entries yet"
            description="Start writing your story — one day, one mood, one memory at a time."
            action="Write First Entry"
            onAction={() => setComposing(true)}
            icon={<BookHeart size={26} />}
          />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search entries..."
                className="w-full rounded-full border border-rose-500/20 bg-background/50 px-9 py-2 text-sm outline-none focus:border-rose-500"
              />
            </div>
            <button
              onClick={() => setComposing((c) => !c)}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
            >
              <Plus size={12} /> New Entry
            </button>
          </div>

          {/* Composer */}
          <AnimatePresence>
            {composing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-strong mt-4 rounded-3xl p-6">
                  <div className="mb-4">
                    <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                      <Smile size={12} /> How are you feeling?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setNewEntry((n) => ({ ...n, mood: m.id }))}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all",
                            newEntry.mood === m.id ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow" : "bg-rose-500/10 hover:bg-rose-500/20"
                          )}
                        >
                          <span>{m.emoji}</span>
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry((n) => ({ ...n, title: e.target.value }))}
                    placeholder="Entry title..."
                    className="mb-3 w-full rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
                  />
                  <textarea
                    value={newEntry.body}
                    onChange={(e) => setNewEntry((n) => ({ ...n, body: e.target.value }))}
                    placeholder="Dear diary, today..."
                    rows={6}
                    className="w-full rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500 custom-scrollbar"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button onClick={() => setComposing(false)} className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-rose-500/10">
                      Cancel
                    </button>
                    <button onClick={submit} className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow">
                      Save Entry
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries */}
          <div className="mt-8 space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-3xl bg-rose-500/5 p-10 text-center text-sm text-muted-foreground">
                {search ? "No entries match your search." : "No entries yet. Write your first above."}
              </div>
            ) : (
              filtered.slice().reverse().map((entry, i) => {
                const mood = moods.find((m) => m.id === entry.mood) || moods[1];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br p-6", mood.color)}
                  >
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                        {formatDate(entry.date)}
                      </span>
                      <button
                        onClick={() => removeJournalEntry(entry.id)}
                        aria-label="Delete entry"
                        className="grid h-7 w-7 place-items-center rounded-full bg-red-500/80 text-white hover:bg-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex items-start gap-4 pr-12">
                      <div className="text-4xl">{mood.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-serif-display text-lg font-bold">{entry.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-foreground/60">{mood.label}</p>
                        {entry.body && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{entry.body}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
