"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
          }}
          className={cn(
            "mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-rose-500/80",
            align === "center" && "justify-center"
          )}
        >
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.1 } },
            }}
            className="h-px w-8 origin-left bg-rose-500/40"
          />
          {eyebrow}
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.1 } },
            }}
            className="h-px w-8 origin-right bg-rose-500/40"
          />
        </motion.div>
      )}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="font-serif-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
          }}
          className="mt-4 text-base text-muted-foreground sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export function SectionWrapper({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8",
        className
      )}
    >
      {children}
    </section>
  );
}
