"use client";

import { useEffect, useRef } from "react";

/**
 * Soft starfield + particle canvas that sits behind everything.
 * Uses requestAnimationFrame with throttling for smoothness.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    type Star = { x: number; y: number; r: number; tw: number; vx: number; vy: number; hue: number };
    const stars: Star[] = [];
    const count = Math.min(120, Math.floor((width * height) / 18000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        tw: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        hue: Math.random() > 0.6 ? 350 : Math.random() > 0.5 ? 25 : 50,
      });
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return; // ~30fps cap
      last = t;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
        s.tw += 0.04;
        const alpha = 0.4 + Math.sin(s.tw) * 0.35;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 75%, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${s.hue}, 80%, 70%, ${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[0] opacity-70"
    />
  );
}
