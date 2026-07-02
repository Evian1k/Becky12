"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";

export function OurStory({ onOpenManager }: { onOpenManager: () => void }) {
  const settings = useContentStore((s) => s.settings);
  const timeline = useContentStore((s) => s.timeline);

  // Derive story chapters from the first few timeline events.
  const chapters = timeline.slice(0, 4).map((e, i) => ({
    title: e.title,
    body: e.description,
    emoji: e.emoji,
    num: i + 1,
  }));

  return (
    <SectionWrapper id="story">
      <SectionHeading
        eyebrow="How We Began"
        title={<>Our <span className="text-gradient-romantic">Story</span></>}
        subtitle={settings.subtitle || "A love story told in chapters — the beginning, the middle, and everything still to come."}
      />

      {chapters.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-14"
        >
          <div className="glass-strong mx-auto max-w-xl rounded-3xl p-10 text-center">
            <motion.div
              animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-500"
            >
              <Heart size={26} fill="currentColor" strokeWidth={0} />
            </motion.div>
            <h3 className="font-serif-display text-xl font-bold sm:text-2xl">Your story awaits</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add timeline events in the Content Manager and they'll appear here as chapters of your love story.
            </p>
            <button
              onClick={onOpenManager}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
            >
              <Sparkles size={14} /> Add your first memory
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="mt-14 space-y-8">
          {chapters.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="glass-strong rounded-3xl p-8 sm:p-10">
                <div className="flex items-start gap-5">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-2xl shadow-glow">
                    {c.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rose-500/70">
                      <span>Chapter {c.num}</span>
                      <span className="h-px w-6 bg-rose-500/30" />
                    </div>
                    <h3 className="mt-1 font-serif-display text-2xl font-bold sm:text-3xl">{c.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">{c.body}</p>
                  </div>
                </div>
              </div>
              {i < chapters.length - 1 && (
                <div className="my-4 flex items-center justify-center gap-2 text-rose-500/40">
                  <span className="h-px w-12 bg-rose-500/20" />
                  <Sparkles size={12} />
                  <span className="h-px w-12 bg-rose-500/20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <Star size={14} className="text-rose-500" fill="currentColor" strokeWidth={0} />
        <span>The best chapters are still being written.</span>
        <Heart size={14} className="text-rose-500" fill="currentColor" strokeWidth={0} />
      </motion.div>
    </SectionWrapper>
  );
}
