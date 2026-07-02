"use client";

import { motion } from "framer-motion";
import { Flame, Heart, Camera, Mail, TrendingUp, Calendar } from "lucide-react";
import { useStreak } from "@/hooks/use-streak";
import { coupleConfig } from "@/data/couple-config";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { fireConfetti } from "@/lib/confetti-helpers";
import { useMounted } from "@/hooks/use-mounted";

function StatCard({ icon, label, value, sublabel }: { icon: React.ReactNode; label: string; value: number; sublabel: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 text-center"
    >
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
        {icon}
      </div>
      <motion.div
        key={value}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="font-serif-display text-4xl font-bold text-gradient-romantic"
      >
        {value}
      </motion.div>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-[10px] text-rose-500/70">{sublabel}</p>
    </motion.div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  done,
  disabled,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  done: boolean;
  disabled: boolean;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-3xl p-5 transition-all",
        done
          ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow"
          : "glass hover:bg-rose-500/10",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">{icon}</div>
      <span className="text-xs font-medium sm:text-sm">{label}</span>
      {done && (
        <span className="text-[10px] uppercase tracking-wider opacity-90">Done today ✓</span>
      )}
    </motion.button>
  );
}

export function Streak() {
  const mounted = useMounted();
  const { state, hydrated, checkIn, addMemory, sendLove } = useStreak(coupleConfig.anniversaryDate);

  const handleCheckIn = () => {
    if (checkIn()) {
      fireConfetti();
    }
  };
  const handleAddMemory = () => {
    if (addMemory()) fireConfetti();
  };
  const handleSendLove = () => {
    if (sendLove()) fireConfetti();
  };

  return (
    <SectionWrapper id="streak">
      <SectionHeading
        eyebrow="Daily Rituals"
        title={<>Couple <span className="text-gradient-romantic">Streak</span> 🔥</>}
        subtitle="Tiny daily acts of love, kept alive — together."
      />

      {/* Flame hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto mt-10 flex max-w-md flex-col items-center"
      >
        <div className="relative grid h-32 w-32 place-items-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-6xl"
          >
            🔥
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-orange-500/30 blur-xl"
          />
        </div>
        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-rose-500/70">Current Streak</p>
        <motion.p
          key={state.currentStreak}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="font-serif-display text-7xl font-bold text-gradient-romantic"
        >
          {mounted && hydrated ? state.currentStreak : 0}
        </motion.p>
        <p className="mt-1 text-xs text-muted-foreground">days of choosing each other</p>
      </motion.div>

      {/* Stat cards */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Flame size={20} className="animate-flame" />}
          label="Current Streak"
          value={mounted && hydrated ? state.currentStreak : 0}
          sublabel="Keep it going!"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Highest Streak"
          value={mounted && hydrated ? state.highestStreak : 0}
          sublabel="Our personal best"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Days Together"
          value={mounted && hydrated ? state.daysTogether : 0}
          sublabel="Since the very first day"
        />
      </div>

      {/* Action buttons */}
      <div className="mt-10">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-rose-500/70">
          Today's Rituals
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActionButton
            onClick={handleCheckIn}
            icon={<Heart size={18} fill="currentColor" strokeWidth={0} />}
            label="❤️ Checked In Today"
            done={mounted && hydrated && state.lastCheckIn === new Date().toISOString().slice(0, 10)}
            disabled={mounted && hydrated && state.lastCheckIn === new Date().toISOString().slice(0, 10)}
          />
          <ActionButton
            onClick={handleAddMemory}
            icon={<Camera size={18} />}
            label="📸 Added Memory"
            done={mounted && hydrated && state.memoryAddedToday}
            disabled={mounted && hydrated && state.memoryAddedToday}
          />
          <ActionButton
            onClick={handleSendLove}
            icon={<Mail size={18} />}
            label="💌 Sent Love"
            done={mounted && hydrated && state.loveSentToday}
            disabled={mounted && hydrated && state.loveSentToday}
          />
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Saved on your device only — no servers, no sync, just us.
      </p>
    </SectionWrapper>
  );
}
