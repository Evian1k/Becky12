"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type Heart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
};

/**
 * Floating hearts that drift upward across the viewport.
 * Lightweight: uses CSS animations, no per-frame React updates.
 */
export function FloatingHearts({ count = 18 }: { count?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const arr: Heart[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 22,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 120,
    }));
    setHearts(arr);
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-[-40px] text-rose-500"
          style={{
            left: `${h.left}%`,
            animation: `drift ${h.duration}s linear ${h.delay}s infinite`,
            // @ts-expect-error custom property
            "--drift-x": `${h.drift}px`,
            opacity: h.opacity,
          }}
        >
          <Heart size={h.size} fill="currentColor" strokeWidth={0} />
        </div>
      ))}
    </div>
  );
}
