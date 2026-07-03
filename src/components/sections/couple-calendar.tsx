"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { useStreak } from "@/hooks/use-streak";
import { useMounted } from "@/hooks/use-mounted";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

function buildCalendarDays(anniversary: string, monthsToShow = 12) {
  const start = new Date(anniversary);
  const today = new Date();
  // Go back N months from today, then snap to start of week (Sunday)
  const end = new Date(today);
  const begin = new Date(today);
  begin.setMonth(begin.getMonth() - (monthsToShow - 1));
  begin.setDate(1);
  // snap to Sunday
  while (begin.getDay() !== 0) begin.setDate(begin.getDate() - 1);

  const days: { date: Date; iso: string; inRange: boolean }[] = [];
  const cursor = new Date(begin);
  while (cursor <= end) {
    const iso = cursor.toISOString().slice(0, 10);
    days.push({ date: new Date(cursor), iso, inRange: cursor >= start && cursor <= today });
    cursor.setDate(cursor.getDate() + 1);
  }
  // pad to multiple of 7
  while (days.length % 7 !== 0) {
    cursor.setDate(cursor.getDate() + 1);
    days.push({ date: new Date(cursor), iso: cursor.toISOString().slice(0, 10), inRange: false });
  }
  return days;
}

const monthLabels = (days: { date: Date }[]) => {
  const labels: { index: number; label: string }[] = [];
  let lastMonth = -1;
  days.forEach((d, i) => {
    if (d.date.getMonth() !== lastMonth && i % 7 === 0) {
      labels.push({
        index: i,
        label: d.date.toLocaleDateString(undefined, { month: "short" }),
      });
      lastMonth = d.date.getMonth();
    }
  });
  return labels;
};

export function CoupleCalendar() {
  const mounted = useMounted();
  const settings = useContentStore((s) => s.settings) || {};
  const anniversary = settings.anniversaryDate || "";
  const { state, hydrated } = useStreak(anniversary);
  const [hovered, setHovered] = useState<string | null>(null);

  const days = useMemo(
    () => buildCalendarDays(anniversary || new Date().toISOString(), 9),
    [anniversary]
  );
  const labels = useMemo(() => monthLabels(days), [days]);

  const checkInSet = useMemo(() => new Set(state.checkIns), [state.checkIns]);

  // Group into columns of 7 (weeks)
  const weeks: { date: Date; iso: string; inRange: boolean }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const totalCheckedIn = state.checkIns.length;

  return (
    <SectionWrapper id="calendar">
      <SectionHeading
        eyebrow="Days We Chose Us"
        title={<>Couple <span className="text-gradient-romantic">Calendar</span></>}
        subtitle="Every day we checked in on each other, marked with a heart."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-10 glass-strong rounded-3xl p-4 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">
            {mounted && hydrated ? totalCheckedIn : 0}{" "}
            <span className="text-muted-foreground">days marked with love</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Less
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-rose-500/10" />
              <div className="h-3 w-3 rounded-sm bg-rose-500/30" />
              <div className="h-3 w-3 rounded-sm bg-rose-500/60" />
              <div className="grid h-3 w-3 place-items-center rounded-sm bg-rose-500">
                <Heart size={8} fill="currentColor" strokeWidth={0} className="text-white" />
              </div>
            </div>
            More
          </div>
        </div>

        {/* Calendar grid */}
        <div className="relative overflow-x-auto custom-scrollbar">
          <div className="flex gap-1 pb-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => {
                  const checked = mounted && hydrated && checkInSet.has(day.iso);
                  const isToday = day.iso === new Date().toISOString().slice(0, 10);
                  return (
                    <motion.div
                      key={day.iso}
                      whileHover={{ scale: 1.4, zIndex: 10 }}
                      onMouseEnter={() => setHovered(day.iso)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        "grid h-3 w-3 place-items-center rounded-sm transition-colors sm:h-3.5 sm:w-3.5",
                        !day.inRange && "bg-transparent",
                        day.inRange && !checked && "bg-rose-500/10 hover:bg-rose-500/30",
                        checked && "bg-rose-500",
                        isToday && "ring-1 ring-rose-500 ring-offset-1 ring-offset-background"
                      )}
                    >
                      {checked && (
                        <Heart size={7} fill="currentColor" strokeWidth={0} className="text-white" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="relative mt-1 h-4">
            {labels.map((l) => (
              <span
                key={l.index}
                className="absolute text-[10px] text-muted-foreground"
                style={{ left: `${(l.index / days.length) * 100}%` }}
              >
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Hover tooltip */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-500/10 p-3 text-sm"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-rose-500/20">
              {checkInSet.has(hovered) ? (
                <Heart size={14} fill="currentColor" strokeWidth={0} className="text-rose-500" />
              ) : (
                <span className="text-xs">📅</span>
              )}
            </div>
            <div>
              <p className="font-medium">
                {new Date(hovered + "T00:00:00").toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {checkInSet.has(hovered)
                  ? "We chose each other this day ❤️"
                  : "A day we missed — but tomorrow is another chance."}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
