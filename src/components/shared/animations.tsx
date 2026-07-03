"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Scroll progress bar — premium top-of-page indicator.
 * Sits fixed at the very top, grows as you scroll.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[200] h-[3px] origin-left bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400"
      aria-hidden
    />
  );
}

/**
 * Section reveal wrapper — fades + slides content in on scroll.
 * Premium staggered feel.
 */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered children container.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.1,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 30,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic hover effect — element gently follows the cursor.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        setPos({ x, y });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Tilt-on-hover 3D card effect.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const [transform, setTransform] = useState("");
  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTransform(
          `perspective(1000px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale(1.02)`
        );
      }}
      onMouseLeave={() => setTransform("")}
      animate={{ transform: transform || "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)" }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Number counter that animates from 0 to value when in view.
 */
export function CountUp({ value, duration = 1.5, className }: { value: number; duration?: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const [ref, setRef] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const animate = (now: number) => {
            const t = Math.min((now - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
            setDisplay(Math.floor(eased * value));
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, value, duration]);

  return (
    <span ref={setRef} className={className}>
      {display}
    </span>
  );
}
