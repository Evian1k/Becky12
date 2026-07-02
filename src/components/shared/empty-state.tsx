"use client";

import { motion } from "framer-motion";
import { Heart, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Empty state component — shown when a section has no content yet.
 * Encourages the user to add their first item via the Content Manager.
 */
export function EmptyState({
  title,
  description,
  action,
  onAction,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-strong mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl p-10 text-center",
        className
      )}
    >
      <motion.div
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-500"
      >
        {icon ?? <Heart size={26} fill="currentColor" strokeWidth={0} />}
      </motion.div>
      <h3 className="font-serif-display text-xl font-bold sm:text-2xl">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
        >
          <Plus size={14} />
          {action}
        </button>
      )}
      <p className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-wider text-rose-500/50">
        <Sparkles size={10} />
        Add via Content Manager
      </p>
    </motion.div>
  );
}
