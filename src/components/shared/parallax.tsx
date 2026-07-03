"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Heart, Sparkles } from "lucide-react";

/**
 * Parallax wrapper — moves its children at a slower rate than scroll,
 * creating depth. Use for backgrounds, hero images, decorative elements.
 */
export function Parallax({
  children,
  offset = 80,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/**
 * Animated section divider — a glowing heart between sections.
 */
export function SectionDivider({ icon = "heart" }: { icon?: "heart" | "sparkle" | "star" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="my-12 flex items-center justify-center gap-3"
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 60 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-px bg-gradient-to-r from-transparent to-rose-500/40"
      />
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-500"
      >
        {icon === "heart" && <Heart size={14} fill="currentColor" strokeWidth={0} />}
        {icon === "sparkle" && <Sparkles size={14} />}
        {icon === "star" && <span className="text-sm">⭐</span>}
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 60 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-px bg-gradient-to-l from-transparent to-rose-500/40"
      />
    </motion.div>
  );
}
