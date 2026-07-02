"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, Pause, Music2, ChevronDown } from "lucide-react";
import { coupleConfig } from "@/data/couple-config";
import { useRelationshipCounter } from "@/hooks/use-relationship-counter";
import { fireHearts } from "@/lib/confetti-helpers";

const slideshow = [
  "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad5c4c?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop",
];

const typewriterPhrases = [
  "Our story is still being written...",
  "Every moment with you is a memory I keep...",
  "You are my favorite hello, my hardest goodbye...",
  "In a sea of people, my eyes will always search for you...",
];

function Typewriter() {
  const [phrase, setPhrase] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = typewriterPhrases[phrase];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === full) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && text === "") {
      setDeleting(false);
      setPhrase((p) => (p + 1) % typewriterPhrases.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((t) =>
            deleting ? full.slice(0, t.length - 1) : full.slice(0, t.length + 1)
          );
        },
        deleting ? 30 : 55
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, phrase]);

  return (
    <span className="inline-block min-h-[1.5em]">
      {text}
      <span className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-rose-400 align-middle" />
    </span>
  );
}

function CounterUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="font-serif-display text-3xl font-bold text-white tabular-nums sm:text-4xl md:text-5xl"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-rose-200/70 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

export function Hero({ onPlayMusic, musicPlaying }: { onPlayMusic: () => void; musicPlaying: boolean }) {
  const { duration, now } = useRelationshipCounter(coupleConfig.anniversaryDate);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slideshow.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            { }
            <img
              src={slideshow[slide]}
              alt="Us"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-aurora-dark opacity-40 mix-blend-soft-light" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 flex items-center gap-3 text-rose-200/80"
        >
          <span className="h-px w-12 bg-rose-300/40" />
          <Heart size={14} fill="currentColor" strokeWidth={0} />
          <span className="text-xs uppercase tracking-[0.3em]">A Love Story</span>
          <Heart size={14} fill="currentColor" strokeWidth={0} />
          <span className="h-px w-12 bg-rose-300/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-script text-7xl leading-none text-white drop-shadow-2xl sm:text-8xl md:text-9xl"
        >
          Our Forever
          <span className="ml-2 inline-block animate-heartbeat text-rose-500">❤️</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-4 max-w-xl text-base text-rose-100/90 sm:text-lg"
        >
          <Typewriter />
        </motion.p>

        {/* Live date & time */}
        {now && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="mt-6 text-sm text-rose-200/70 tabular-nums"
          >
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="mx-2 text-rose-400">•</span>
            {now.toLocaleTimeString(undefined, { hour12: true })}
          </motion.div>
        )}

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-10 flex flex-col items-center"
        >
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rose-300/80">
            <Heart size={12} fill="currentColor" strokeWidth={0} className="animate-heartbeat" />
            Together for
            <Heart size={12} fill="currentColor" strokeWidth={0} className="animate-heartbeat" />
          </div>
          <div className="glass-strong flex items-center gap-4 rounded-3xl px-6 py-5 sm:gap-6 sm:px-10">
            {duration && (
              <>
                <CounterUnit value={duration.years} label="Years" />
                <span className="text-2xl text-rose-400/40">·</span>
                <CounterUnit value={duration.months} label="Months" />
                <span className="text-2xl text-rose-400/40">·</span>
                <CounterUnit value={duration.days} label="Days" />
                <span className="text-2xl text-rose-400/40">·</span>
                <CounterUnit value={duration.hours} label="Hours" />
                <span className="text-2xl text-rose-400/40">·</span>
                <CounterUnit value={duration.minutes} label="Min" />
                <span className="text-2xl text-rose-400/40">·</span>
                <CounterUnit value={duration.seconds} label="Sec" />
              </>
            )}
          </div>
          <p className="mt-3 text-xs text-rose-200/50">
            {duration?.totalDays.toLocaleString()} days of us — and counting.
          </p>
        </motion.div>

        {/* Music play button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 1 }}
          className="mt-8"
        >
          <button
            onClick={() => {
              onPlayMusic();
              fireHearts();
            }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-7 py-3.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 animate-shimmer" />
            <span className="relative flex items-center gap-2">
              {musicPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {musicPlaying ? "Pause Music" : "Play Our Song"}
              <Music2 size={14} className="opacity-80" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slideshow.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === slide ? "w-8 bg-rose-400" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-rose-200/60"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
