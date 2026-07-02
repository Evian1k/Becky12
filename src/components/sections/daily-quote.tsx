"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Heart } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { fireHearts } from "@/lib/confetti-helpers";

export function DailyQuote({ onOpenManager }: { onOpenManager: () => void }) {
  const quotes = useContentStore((s) => s.quotes);
  const [index, setIndex] = useState(0);
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    if (quotes.length > 0) {
      const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      setQuote(quotes[day % quotes.length]);
      setIndex(day % quotes.length);
    } else {
      setQuote(null);
    }
  }, [quotes]);

  const refresh = () => {
    if (quotes.length === 0) return;
    let next = index;
    while (next === index && quotes.length > 1) {
      next = Math.floor(Math.random() * quotes.length);
    }
    setIndex(next);
    setQuote(quotes[next]);
    fireHearts();
  };

  if (!quote) {
    return (
      <SectionWrapper id="quote">
        <div className="mt-4">
          <EmptyState
            title="No quotes yet"
            description="Add romantic quotes — your favorites, lines from songs, movie quotes, things they've said."
            action="Add Your First Quote"
            onAction={onOpenManager}
            icon={<Quote size={26} />}
          />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="quote">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl"
      >
        <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-rose-500/20"
                style={{ left: `${10 + i * 16}%`, top: `${15 + (i % 3) * 25}%` }}
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart size={16} fill="currentColor" strokeWidth={0} />
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow">
              <Quote size={22} />
            </div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-500/70">Today's Love Quote</p>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4"
              >
                <p className="font-serif-display text-2xl font-medium leading-relaxed sm:text-3xl md:text-4xl">"{quote.text}"</p>
                <footer className="mt-4 text-sm text-muted-foreground">— {quote.author || "Unknown"}</footer>
              </motion.blockquote>
            </AnimatePresence>
            <button
              onClick={refresh}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-5 py-2.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/20"
            >
              <RefreshCw size={12} className="transition-transform group-hover:rotate-180" />
              New Quote
            </button>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
