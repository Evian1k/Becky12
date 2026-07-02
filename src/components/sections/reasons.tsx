"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { reasons } from "@/data/reasons";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";

function FlipCard({ reason, index }: { reason: { short: string; long: string }; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      onClick={() => setFlipped((f) => !f)}
      className="perspective-1000 relative h-40 w-full"
      aria-label={`Reason ${index + 1}: ${reason.short}`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="preserve-3d relative h-full w-full"
      >
        {/* Front */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl glass p-4 text-center">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
            <Heart size={14} fill="currentColor" strokeWidth={0} />
          </div>
          <p className="text-xs font-medium leading-tight text-foreground sm:text-sm">
            {reason.short}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-rose-500/60">Tap to flip</p>
        </div>

        {/* Back */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 p-4 text-center text-white"
          style={{ transform: "rotateY(180deg)" }}
        >
          <Sparkles size={14} className="mb-2 opacity-80" />
          <p className="text-[11px] leading-relaxed sm:text-xs">{reason.long}</p>
        </div>
      </motion.div>
    </motion.button>
  );
}

export function Reasons() {
  return (
    <SectionWrapper id="reasons">
      <SectionHeading
        eyebrow="Why I Love You"
        title={<>Reasons I <span className="text-gradient-romantic">Love You</span></>}
        subtitle={`${reasons.length} reasons — and counting. Tap any card to read why.`}
      />

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {reasons.map((r, i) => (
          <FlipCard key={i} reason={r} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
