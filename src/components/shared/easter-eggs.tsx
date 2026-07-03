"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles, Gift } from "lucide-react";
import { useKonamiCode } from "@/hooks/use-konami";
import { fireConfetti, fireFireworks, fireHearts } from "@/lib/confetti-helpers";

const SECRET_LETTER = `My dearest love,

If you're reading this, it means you found the secret I hid just for you — a little treasure hunt in the middle of our little corner of the internet.

I wanted there to be surprises here. Little mysteries. Hidden rooms. The way you always find new things to love about me, and I about you. I never want us to stop discovering each other.

So here's my secret, in plain sight: I love you. I love you in a way I didn't know was possible before you. I love you in a way that grows every day, like a sky that just keeps getting wider. I love you in a way that makes me braver, kinder, softer, better.

If you ever forget — even for a moment — come back here. Read this. Remember.

You are the best thing that ever happened to me. And I will spend the rest of my life making sure you know it.

Forever,
Me ❤️`;

export function EasterEggs() {
  const [secretLetterOpen, setSecretLetterOpen] = useState(false);
  const [konamiOpen, setKonamiOpen] = useState(false);
  const [heartClicks, setHeartClicks] = useState(0);
  const [showClickHint, setShowClickHint] = useState(false);

  const handleKonami = useCallback(() => {
    setKonamiOpen(true);
    fireFireworks();
  }, []);

  useKonamiCode(handleKonami);

  // Heart click easter egg: floating heart in bottom corner
  const onHeartClick = () => {
    const next = heartClicks + 1;
    setHeartClicks(next);
    if (next >= 10) {
      setSecretLetterOpen(true);
      fireHearts();
      setHeartClicks(0);
    } else if (next >= 5) {
      setShowClickHint(true);
      fireHearts();
      setTimeout(() => setShowClickHint(false), 1500);
    } else {
      fireHearts();
    }
  };

  // Birthday / anniversary auto-mode (visual demo)
  useEffect(() => {
    const today = new Date();
    const isFeb14 = today.getMonth() === 1 && today.getDate() === 14;
    if (isFeb14) {
      const t = setTimeout(() => fireConfetti(), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      {/* Floating clickable heart — always present */}
      <motion.button
        onClick={onHeartClick}
        aria-label="Click the heart"
        className="fixed bottom-5 right-5 z-[80] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3, type: "spring" }}
      >
        <Heart size={20} fill="currentColor" strokeWidth={0} className="animate-heartbeat" />
        {heartClicks > 0 && (
          <motion.span
            key={heartClicks}
            initial={{ scale: 0, y: 0 }}
            animate={{ scale: 1, y: -20, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-2 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-rose-500"
          >
            {heartClicks}
          </motion.span>
        )}
        <AnimatePresence>
          {showClickHint && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-12 whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[10px] text-white"
            >
              {10 - heartClicks} more...
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Secret letter modal */}
      <AnimatePresence>
        {secretLetterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSecretLetterOpen(false)}
            className="fixed inset-0 z-[160] grid place-items-center bg-black/80 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.7, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.7, rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto custom-scrollbar rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-8 shadow-2xl dark:from-rose-950 dark:to-pink-950 sm:p-10"
            >
              <button
                onClick={() => setSecretLetterOpen(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
              >
                <X size={16} />
              </button>

              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-rose-500">
                <Gift size={14} />
                <span>You found a secret</span>
              </div>

              <h3 className="font-script text-3xl text-rose-600 dark:text-rose-300">
                A Hidden Letter
              </h3>

              <div className="mt-6 whitespace-pre-line font-serif text-sm leading-relaxed text-foreground/80 sm:text-base" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {SECRET_LETTER}
              </div>

              <div className="mt-6 flex justify-center">
                <Heart size={20} className="text-rose-500 animate-heartbeat" fill="currentColor" strokeWidth={0} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami modal */}
      <AnimatePresence>
        {konamiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setKonamiOpen(false)}
            className="fixed inset-0 z-[160] grid place-items-center bg-black/80 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-center text-white shadow-2xl"
            >
              <button
                onClick={() => setKonamiOpen(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30"
              >
                <X size={16} />
              </button>
              <Sparkles size={40} className="mx-auto mb-4" />
              <h3 className="font-script text-4xl">Cheat Code Activated</h3>
              <p className="mt-4 text-sm opacity-90">
                You found the Konami code. As a reward... unlimited love. ❤️
              </p>
              <p className="mt-2 text-xs opacity-70">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </p>
              <p className="mt-6 text-3xl">💕💖💗💓💞</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
