"use client";

import { motion } from "framer-motion";
import { Heart, Calendar } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { SmartImage } from "@/components/shared/smart-media";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export function Timeline({ onOpenManager }: { onOpenManager: () => void }) {
  const timeline = useContentStore((s) => s.timeline);

  return (
    <SectionWrapper id="timeline" className="py-24 sm:py-32">
      <SectionHeading
        eyebrow="The Journey"
        title={<>Our <span className="text-gradient-romantic">Timeline</span></>}
        subtitle="Every milestone is a chapter — and every chapter is ours."
      />

      {timeline.length === 0 ? (
        <div className="mt-16">
          <EmptyState
            title="No memories yet"
            description="Add your first text, first call, first date, first kiss — every milestone that brought you here."
            action="Add Your First Memory"
            onAction={onOpenManager}
            icon={<Calendar size={26} />}
          />
        </div>
      ) : (
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/0 via-rose-500/40 to-rose-500/0 md:left-1/2" />
          <div className="space-y-12 md:space-y-20">
            {timeline.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("relative flex items-center gap-6", isLeft ? "md:flex-row" : "md:flex-row-reverse")}
                >
                  <div className="absolute left-4 z-10 -translate-x-1/2 md:left-1/2">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-glow"
                    >
                      <Heart size={16} fill="currentColor" strokeWidth={0} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                  <div className={cn("ml-12 w-full md:ml-0 md:w-1/2", isLeft ? "md:pl-12" : "md:pr-12 md:text-right")}>
                    <motion.div whileHover={{ y: -4 }} className="glass-strong overflow-hidden rounded-3xl">
                      {event.image && (
                        <div className="relative h-44 overflow-hidden sm:h-52">
                          <SmartImage src={event.image} alt={event.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
                            <span className="text-base">{event.emoji}</span>
                            {formatDate(event.date)}
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-serif-display text-xl font-bold text-foreground">
                          {event.emoji} {event.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
