"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Soft glow that follows the cursor — a subtle premium touch.
 * Disabled on touch devices and when reduced motion is preferred.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    const handler = (e: MouseEvent) => {
      x.set(e.clientX - 150);
      y.set(e.clientY - 150);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed z-[5] h-[300px] w-[300px] rounded-full opacity-40 mix-blend-soft-light"
    >
      <div className="h-full w-full rounded-full bg-gradient-radial from-rose-400/40 via-pink-300/20 to-transparent" />
    </motion.div>
  );
}
