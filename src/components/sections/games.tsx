"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Brain, Hand, RefreshCw, Heart, HelpCircle, Sparkles } from "lucide-react";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import {
  MemoryGame,
  RockPaperScissors,
  SpinWheel,
  LoveQuiz,
  WouldYouRather,
} from "@/components/games/game-components";

const games = [
  { id: "memory", label: "Memory Match", icon: Brain, component: MemoryGame },
  { id: "rps", label: "Rock Paper Scissors", icon: Hand, component: RockPaperScissors },
  { id: "wheel", label: "Spin The Wheel", icon: RefreshCw, component: SpinWheel },
  { id: "quiz", label: "Love Quiz", icon: Heart, component: LoveQuiz },
  { id: "wyr", label: "Would You Rather", icon: HelpCircle, component: WouldYouRather },
];

export function Games() {
  const [active, setActive] = useState(games[0].id);
  const ActiveComponent = games.find((g) => g.id === active)!.component;

  return (
    <SectionWrapper id="games">
      <SectionHeading
        eyebrow="Just For Fun"
        title={<>Mini <span className="text-gradient-romantic">Games</span></>}
        subtitle="Little games, just for us. No winners or losers — only love."
      />

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm",
              active === g.id
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow"
                : "glass text-foreground/70 hover:text-foreground"
            )}
          >
            <g.icon size={14} />
            <span className="hidden sm:inline">{g.label}</span>
          </button>
        ))}
      </div>

      {/* Game area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-8 glass-strong rounded-3xl p-6 sm:p-10"
      >
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-rose-500/70">
          <Gamepad2 size={14} />
          {games.find((g) => g.id === active)!.label}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles size={12} className="text-rose-500" />
        <span>Every game is just an excuse to spend time with you.</span>
      </div>
    </SectionWrapper>
  );
}
