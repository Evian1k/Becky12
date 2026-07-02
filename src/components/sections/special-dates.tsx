"use client";

import { motion } from "framer-motion";
import { Calendar, Cake, Heart, Plane, Sparkles, Star } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

function daysUntil(dateStr: string, recurring: boolean): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let target = new Date(dateStr);
  if (recurring) {
    target.setFullYear(today.getFullYear());
    if (target < today) target.setFullYear(today.getFullYear() + 1);
  }
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }); } catch { return ""; }
}

const typeEmoji: Record<string, string> = {
  birthday: "🎂",
  anniversary: "💕",
  trip: "✈️",
  holiday: "🎉",
  other: "⭐",
};

export function SpecialDates({ onOpenManager }: { onOpenManager: () => void }) {
  const specialDates = useContentStore((s) => s.specialDates);
  const settings = useContentStore((s) => s.settings);

  // Auto-include anniversary from settings if set
  const allDates = settings.anniversaryDate
    ? [
        {
          id: "anniversary-auto",
          title: "Our Anniversary",
          date: settings.anniversaryDate,
          emoji: "💕",
          description: "The day we became us.",
          recurring: true,
        },
        ...specialDates,
      ]
    : specialDates;

  // Sort by upcoming
  const sorted = allDates
    .map((d) => ({ ...d, _days: daysUntil(d.date, d.recurring) }))
    .sort((a, b) => a._days - b._days);

  return (
    <SectionWrapper id="calendar">
      <SectionHeading
        eyebrow="Mark The Calendar"
        title={<>Special <span className="text-gradient-romantic">Dates</span></>}
        subtitle="Birthdays, anniversaries, trips — every day that means something to us."
      />

      {allDates.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No special dates yet"
            description="Add birthdays, anniversaries, first dates, first kiss — and see live countdowns to each one."
            action="Add First Date"
            onAction={onOpenManager}
            icon={<Calendar size={26} />}
          />
        </div>
      ) : (
        <>
          {/* Next upcoming — hero card */}
          {sorted[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto mt-10 max-w-xl"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 p-8 text-center text-white shadow-glow">
                <div className="pointer-events-none absolute inset-0 opacity-30">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-4xl"
                      style={{ left: `${15 + i * 18}%`, top: `${15 + (i % 2) * 60}%` }}
                      animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                      transition={{ duration: 4 + i, repeat: Infinity }}
                    >
                      {sorted[0].emoji}
                    </motion.div>
                  ))}
                </div>
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/80">Next up in</p>
                  <motion.div
                    key={sorted[0]._days}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                    className="my-2 font-serif-display text-7xl font-bold tabular-nums"
                  >
                    {sorted[0]._days}
                  </motion.div>
                  <p className="text-sm uppercase tracking-wider text-white/80">days</p>
                  <h3 className="mt-4 font-serif-display text-2xl font-bold">{sorted[0].title}</h3>
                  <p className="mt-1 text-xs text-white/70">{formatDate(sorted[0].date)}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid of all dates */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl p-5",
                  d._days <= 7 && d._days >= 0
                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow"
                    : "glass"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl">
                    {d.emoji}
                  </div>
                  <div className="text-right">
                    <div className={cn("font-serif-display text-2xl font-bold tabular-nums", d._days <= 7 && d._days >= 0 ? "text-white" : "text-rose-500")}>
                      {d._days}
                    </div>
                    <div className={cn("text-[10px] uppercase tracking-wider", d._days <= 7 && d._days >= 0 ? "text-white/80" : "text-muted-foreground")}>
                      days
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 font-serif-display text-base font-bold">{d.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(d.date)}</p>
                {d.description && <p className="mt-2 text-xs text-muted-foreground">{d.description}</p>}
                {d.recurring && (
                  <div className={cn("mt-3 inline-block rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider", d._days <= 7 && d._days >= 0 ? "bg-white/20 text-white" : "bg-rose-500/10 text-rose-500")}>
                    Recurs yearly
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
