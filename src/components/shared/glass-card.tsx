"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Glassmorphic card with subtle hover lift. Apple Liquid Glass aesthetic.
 */
export function GlassCard({
  children,
  className,
  hover = true,
  strong = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  strong?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "rounded-3xl p-6",
        strong ? "glass-strong" : "glass",
        hover && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
