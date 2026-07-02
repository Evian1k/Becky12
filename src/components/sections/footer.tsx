"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { fireHearts } from "@/lib/confetti-helpers";

export function Footer() {
  const settings = useContentStore((s) => s.settings);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative z-10 mt-20 overflow-hidden bg-gradient-to-b from-transparent via-rose-950/20 to-rose-950/40 dark:via-rose-950/30 dark:to-rose-950/60">
      <div className="pointer-events-none absolute inset-0 bg-aurora-dark opacity-40" />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-glow"
          >
            <Heart size={28} fill="currentColor" strokeWidth={0} className="text-white" />
          </motion.div>

          <p className="mx-auto max-w-2xl font-serif-display text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
            {settings.finalMessage}
          </p>

          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{settings.madeBy}</span>
          </div>

          <p className="mt-2 font-script text-2xl text-rose-500">Forever & Always.</p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => { fireHearts(); scrollTop(); }}
              className="group flex items-center gap-2 rounded-full glass px-5 py-2.5 text-xs font-medium hover:bg-rose-500/10"
            >
              <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
              Back to Top
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-rose-500/50">
            <span className="h-px w-8 bg-rose-500/30" />
            <span>{settings.title || "Our Forever"}</span>
            <span className="h-px w-8 bg-rose-500/30" />
          </div>

          <p className="mt-4 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} — A love letter, written in code.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
