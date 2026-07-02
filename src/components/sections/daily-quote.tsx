"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Heart } from "lucide-react";
import { loveQuotes } from "@/data/quotes";
import { SectionWrapper } from "@/components/shared/section-heading";
import { fireHearts } from "@/lib/confetti-helpers";

function getDailyQuote() {
  // Pick a deterministic quote based on the day of year, so it changes daily.
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return loveQuotes[day % loveQuotes.length];
}

export function DailyQuote() {
  const [index, setIndex] = useState(0);
  const [quote, setQuote] = useState(loveQuotes[0]);

  useEffect(() => {
    setQuote(getDailyQuote());
  }, []);

  const refresh = () => {
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * loveQuotes.length);
    }
    setIndex(next);
    setQuote(loveQuotes[next]);
    fireHearts();
  };

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
          {/* Floating hearts decoration */}
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

            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-500/70">
              Today's Love Quote
            </p>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quote.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4"
              >
                <p className="font-serif-display text-2xl font-medium leading-relaxed sm:text-3xl md:text-4xl">
                  "{quote.text}"
                </p>
                <footer className="mt-4 text-sm text-muted-foreground">— {quote.author}</footer>
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
