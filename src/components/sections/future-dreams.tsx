"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export function FutureDreams({ onOpenManager }: { onOpenManager: () => void }) {
  const dreams = useContentStore((s) => s.futureDreams);

  if (dreams.length === 0) {
    return (
      <SectionWrapper id="future">
        <SectionHeading
          eyebrow="What's Ahead"
          title={<>Future <span className="text-gradient-romantic">Dreams</span></>}
          subtitle="Everything I want to build with you — for the rest of our lives."
        />
        <div className="mt-12">
          <EmptyState
            title="No dreams yet"
            description="Add the things you dream of doing together — a home, travel, marriage, kids, adventures."
            action="Add Your First Dream"
            onAction={onOpenManager}
            icon={<Sparkles size={26} />}
          />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="future">
      <SectionHeading
        eyebrow="What's Ahead"
        title={<>Future <span className="text-gradient-romantic">Dreams</span></>}
        subtitle="Everything I want to build with you — for the rest of our lives."
      />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dreams.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
            whileHover={{ y: -8 }}
            className={cn("group relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-left", d.gradient || "from-rose-400/30 to-pink-500/30")}
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/20 backdrop-blur text-3xl"
              >
                {d.emoji}
              </motion.div>
              <h3 className="font-serif-display text-xl font-bold">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{d.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-rose-500">
                <span>Coming soon</span>
                <span className="animate-pulse">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
