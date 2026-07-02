"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Target } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { fireConfetti } from "@/lib/confetti-helpers";

const STORAGE_KEY = "our-forever-bucket-list-progress";

export function BucketListSection({ onOpenManager }: { onOpenManager: () => void }) {
  const bucketList = useContentStore((s) => s.bucketList);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const persist = (next: Record<string, boolean>) => {
    setDone(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    persist(next);
    if (next[id]) fireConfetti();
  };

  const completedCount = Object.values(done).filter(Boolean).length;

  return (
    <SectionWrapper id="bucket-list">
      <SectionHeading
        eyebrow="Things We'll Do"
        title={<>Bucket <span className="text-gradient-romantic">List</span></>}
        subtitle="Dreams we'll chase together — one check at a time."
      />

      {bucketList.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No dreams yet"
            description="Add the things you want to do together — places to visit, experiences to share, goals to chase."
            action="Add Your First Goal"
            onAction={onOpenManager}
            icon={<Target size={26} />}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="glass flex items-center gap-3 rounded-full px-5 py-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-sm font-medium">
                {hydrated ? completedCount : 0} / {bucketList.length} complete
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bucketList.map((item, i) => {
              const isDone = hydrated && done[item.id];
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "relative overflow-hidden rounded-3xl p-6 text-left transition-all",
                    isDone ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow" : "glass hover:bg-rose-500/5"
                  )}
                >
                  <div className="relative">
                    <div className="mb-3 flex items-start justify-between">
                      <div className={cn("grid h-12 w-12 place-items-center rounded-2xl text-2xl", isDone ? "bg-white/20" : "bg-rose-500/10")}>
                        {item.emoji}
                      </div>
                      <div className={cn("grid h-7 w-7 place-items-center rounded-full border-2 transition-all", isDone ? "border-white bg-white text-rose-500" : "border-rose-500/30 text-transparent")}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </div>
                    <h3 className="font-serif-display text-lg font-bold">{item.title}</h3>
                    <p className={cn("mt-1.5 text-xs leading-relaxed", isDone ? "text-white/80" : "text-muted-foreground")}>
                      {item.description}
                    </p>
                    <div className={cn("mt-3 text-[10px] uppercase tracking-wider", isDone ? "text-white/70" : "text-rose-500/60")}>
                      {item.category}
                    </div>
                  </div>
                  <AnimatePresence>
                    {isDone && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute right-3 top-3">
                        <Heart size={14} fill="currentColor" strokeWidth={0} className="text-white animate-heartbeat" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
