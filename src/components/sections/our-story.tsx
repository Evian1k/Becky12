"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";

const chapters = [
  {
    title: "The Beginning",
    emoji: "✨",
    body: "It started with a message. A simple hello that turned into a four-hour conversation, then a first date that lasted until the restaurant closed, then a walk under streetlights that neither of us wanted to end. We didn't know it then, but the universe had been quietly arranging itself around us for years, slowly pulling us toward this exact moment.",
  },
  {
    title: "The Falling",
    emoji: "💫",
    body: "It happened the way the best things happen — slowly, then all at once. I noticed the way you tilted your head when you laughed. The way you remembered small things I'd said weeks ago. The way my hand felt in yours, like our fingers had been practicing for this their whole lives. One Tuesday evening, watching you talk about your day, I realized: oh. This is it. This is the love I've been waiting for.",
  },
  {
    title: "The Becoming",
    emoji: "🌱",
    body: "We grew together, the way two trees planted close grow — separate roots, separate trunks, but branches that have learned each other's shape. We fought, we forgave, we learned each other's love languages and silences. We made traditions out of ordinary things: Sunday mornings, inside jokes, a song that became 'ours'. We became an 'us', and 'us' became the most natural word in our vocabulary.",
  },
  {
    title: "The Forever",
    emoji: "❤️",
    body: "And here we are. Still writing. Still discovering. Still choosing each other, every single day. The story isn't finished — it's barely begun. There are chapters we haven't lived yet: a wedding, a home, adventures we haven't even dreamed of, an old age where we'll sit on a porch somewhere and remember all of this. This website is just one page of a very long book. Thank you for being my co-author.",
  },
];

export function OurStory() {
  return (
    <SectionWrapper id="story">
      <SectionHeading
        eyebrow="How We Began"
        title={<>Our <span className="text-gradient-romantic">Story</span></>}
        subtitle="A love story told in chapters — the beginning, the middle, and everything still to come."
      />

      <div className="mt-14 space-y-8">
        {chapters.map((c, i) => (
          <motion.div
            key={c.title}
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
                    <span>Chapter {i + 1}</span>
                    <span className="h-px w-6 bg-rose-500/30" />
                  </div>
                  <h3 className="mt-1 font-serif-display text-2xl font-bold sm:text-3xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                    {c.body}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative connector */}
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
