"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { useStreak } from "@/hooks/use-streak";
import { useMounted } from "@/hooks/use-mounted";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export function Achievements() {
  const mounted = useMounted();
  const settings = useContentStore((s) => s.settings) || {};
  const achievements = useContentStore((s) => s.achievements);
  const recompute = useContentStore((s) => s.recomputeAchievements);
  const anniversary = settings.anniversaryDate || "";
  const { state, hydrated } = useStreak(anniversary);

  // Recompute on every render-related state change
  useEffect(() => {
    if (mounted && hydrated) {
      recompute(state.currentStreak);
    }
  }, [mounted, hydrated, state.currentStreak, recompute]);

  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  return (
    <SectionWrapper id="achievements">
      <SectionHeading
        eyebrow="Milestones"
        title={<>Achievements</>}
        subtitle="Badges we unlock together as our story grows."
      />

      {/* Stats */}
      <div className="mx-auto mt-8 flex max-w-md items-center justify-around rounded-3xl glass p-5">
        <div className="text-center">
          <div className="font-serif-display text-3xl font-bold text-gradient-romantic">{unlocked.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Unlocked</div>
        </div>
        <div className="h-10 w-px bg-rose-500/20" />
        <div className="text-center">
          <div className="font-serif-display text-3xl font-bold">{achievements.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
        </div>
        <div className="h-10 w-px bg-rose-500/20" />
        <div className="text-center">
          <div className="font-serif-display text-3xl font-bold text-rose-500">{Math.round((unlocked.length / achievements.length) * 100)}%</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Complete</div>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-rose-500">
            <Trophy size={12} /> Unlocked ({unlocked.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {unlocked.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, type: "spring" }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 p-5 text-center text-white shadow-glow"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-white/20 text-4xl backdrop-blur"
                >
                  {a.emoji}
                </motion.div>
                <h4 className="font-serif-display text-sm font-bold">{a.title}</h4>
                <p className="mt-1 text-[10px] text-white/80">{a.description}</p>
                <p className="mt-2 text-[9px] uppercase tracking-wider text-white/60">
                  {new Date(a.unlockedAt!).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Lock size={12} /> In Progress ({locked.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {locked.map((a, i) => {
              const pct = a.target ? Math.min(100, (a.progress! / a.target) * 100) : 0;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="relative overflow-hidden rounded-3xl glass p-5 text-center"
                >
                  <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-rose-500/5 text-4xl opacity-40 grayscale">
                    {a.emoji}
                  </div>
                  <h4 className="font-serif-display text-sm font-bold text-foreground/70">{a.title}</h4>
                  <p className="mt-1 text-[10px] text-muted-foreground">{a.description}</p>
                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-rose-500/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-[9px] tabular-nums text-muted-foreground">
                      {a.progress} / {a.target}
                    </p>
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
