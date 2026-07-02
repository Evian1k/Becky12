"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 500);
      }
      setProgress(p);
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-rose-950 via-pink-950 to-purple-950"
        >
          {/* Soft aurora glow */}
          <div className="pointer-events-none absolute inset-0 bg-aurora-dark opacity-60" />
          {/* Floating heart */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-white/10 backdrop-blur-xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart size={40} className="text-rose-400" fill="currentColor" strokeWidth={0} />
              </motion.div>
              <div className="absolute inset-0 rounded-full ring-1 ring-rose-400/30" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-rose-400/50"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-script text-5xl text-white sm:text-6xl"
          >
            Our Forever
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-2 text-sm tracking-[0.3em] text-rose-200/70 uppercase"
          >
            A Love Story
          </motion.p>

          {/* Progress bar */}
          <div className="mt-10 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-300"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-3 text-xs text-rose-200/50 tabular-nums"
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
