"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Heart } from "lucide-react";
import { loveLetters, type LoveLetter } from "@/data/letters";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";

function Envelope({ letter, onOpen }: { letter: LoveLetter; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -6 }}
      onClick={() => {
        setOpening(true);
        setTimeout(onOpen, 600);
      }}
      className="group relative h-56 w-full max-w-sm"
    >
      {/* Envelope body */}
      <div className="absolute bottom-0 left-0 right-0 top-8 overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg dark:from-rose-900/40 dark:to-pink-900/40">
        {/* diagonal flap */}
        <motion.div
          animate={{ rotateX: opening ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "top" }}
          className="absolute inset-x-0 top-0 h-0 w-0"
          // triangle via borders
        >
          <div
            className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[110px] border-t-[80px] border-x-transparent border-t-rose-300 dark:border-t-rose-700"
          />
        </motion.div>

        {/* Letter peeking out */}
        <motion.div
          animate={{ y: opening ? -120 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-3 top-3 h-32 rounded-md bg-white p-3 shadow-md dark:bg-rose-50"
        >
          <p className="font-script text-base text-rose-600">{letter.recipient}</p>
          <p className="mt-1 text-[10px] text-gray-500">{letter.date}</p>
          <p className="mt-2 text-xs italic text-gray-600">{letter.preview}</p>
          <div className="absolute bottom-2 right-3">
            <Heart size={12} className="text-rose-400" fill="currentColor" strokeWidth={0} />
          </div>
        </motion.div>

        {/* Bottom fold (triangle pointing down) */}
        <div className="absolute inset-x-0 bottom-0 h-12">
          <div className="absolute left-0 bottom-0 h-0 w-0 border-y-[40px] border-l-[100px] border-y-transparent border-l-rose-200 dark:border-l-rose-800/60" />
          <div className="absolute right-0 bottom-0 h-0 w-0 border-y-[40px] border-r-[100px] border-y-transparent border-r-rose-200 dark:border-r-rose-800/60" />
        </div>

        {/* Wax seal */}
        {!opening && (
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute left-1/2 top-1/2 z-10 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-glow"
          >
            <Heart size={16} fill="currentColor" strokeWidth={0} className="text-white" />
          </motion.div>
        )}
      </div>

      {/* Caption */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100">
        Click to open
      </div>
    </motion.button>
  );
}

function LetterModal({ letter, onClose }: { letter: LoveLetter; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] grid place-items-center bg-black/70 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40, rotateX: -20 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto custom-scrollbar rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-8 shadow-2xl dark:from-rose-950/80 dark:to-pink-950/80 sm:p-12"
      >
        <button
          onClick={onClose}
          aria-label="Close letter"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
        >
          <X size={16} />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-script text-2xl text-rose-600 dark:text-rose-300">{letter.recipient}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-rose-400">{letter.date}</p>

          <div className="mt-6 space-y-4">
            {letter.body.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                className="font-serif text-sm leading-relaxed text-gray-700 dark:text-rose-50/90 sm:text-base"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + letter.body.length * 0.15 + 0.2 }}
            className="mt-8 font-script text-xl text-rose-600 dark:text-rose-300"
          >
            {letter.signature}
            <br />
            <span className="text-lg">Me</span>
          </motion.p>

          <div className="mt-6 flex justify-center">
            <Heart size={20} className="text-rose-500 animate-heartbeat" fill="currentColor" strokeWidth={0} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Letters() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper id="letters">
      <SectionHeading
        eyebrow="Words From The Heart"
        title={<>Love <span className="text-gradient-romantic">Letters</span></>}
        subtitle="Tap an envelope to read a letter written just for you."
      />

      <div className="mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {loveLetters.map((l, i) => (
          <Envelope key={l.id} letter={l} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Mail size={14} />
        <span>Each envelope holds a piece of my heart.</span>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <LetterModal letter={loveLetters[openIndex]} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
