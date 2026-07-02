"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Heart } from "lucide-react";
import { memoryGameCards, loveQuizQuestions, wouldYouRather } from "@/data/games";
import { fireConfetti } from "@/lib/confetti-helpers";
import { cn } from "@/lib/utils";

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const init = () => {
    const deck = shuffle([...memoryGameCards, ...memoryGameCards]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }));
    setCards(deck);
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setWon(true);
      fireConfetti();
    }
  }, [cards]);

  const flip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected.map((sid) => newCards.find((c) => c.id === sid)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.emoji === a.emoji ? { ...c, matched: true } : c)));
          setSelected([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)));
          setSelected([]);
        }, 900);
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm">
          Moves: <span className="font-bold text-rose-500">{moves}</span>
        </p>
        <button
          onClick={init}
          className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-500/20"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => flip(card.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="perspective-1000 relative aspect-square"
          >
            <motion.div
              animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              className="preserve-3d relative h-full w-full"
            >
              <div className="backface-hidden absolute inset-0 grid place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
                <Heart size={20} fill="currentColor" strokeWidth={0} />
              </div>
              <div
                className={cn(
                  "backface-hidden absolute inset-0 grid place-items-center rounded-xl text-2xl shadow-lg",
                  card.matched ? "bg-rose-500/20" : "glass-strong"
                )}
                style={{ transform: "rotateY(180deg)" }}
              >
                {card.emoji}
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 p-3 text-white"
          >
            <Trophy size={16} />
            <span className="text-sm font-medium">You won in {moves} moves! ❤️</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RockPaperScissors() {
  const choices = [
    { name: "rock", emoji: "✊" },
    { name: "paper", emoji: "✋" },
    { name: "scissors", emoji: "✌️" },
  ] as const;

  const [player, setPlayer] = useState<(typeof choices)[number] | null>(null);
  const [computer, setComputer] = useState<(typeof choices)[number] | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0, d: 0 });

  const play = (choice: (typeof choices)[number]) => {
    const comp = choices[Math.floor(Math.random() * 3)];
    setPlayer(choice);
    setComputer(comp);

    let r: "win" | "lose" | "draw";
    if (choice.name === comp.name) r = "draw";
    else if (
      (choice.name === "rock" && comp.name === "scissors") ||
      (choice.name === "paper" && comp.name === "rock") ||
      (choice.name === "scissors" && comp.name === "paper")
    )
      r = "win";
    else r = "lose";
    setResult(r);

    setScore((s) => ({
      w: s.w + (r === "win" ? 1 : 0),
      l: s.l + (r === "lose" ? 1 : 0),
      d: s.d + (r === "draw" ? 1 : 0),
    }));

    if (r === "win") fireConfetti();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-around text-center">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">You</p>
          <p className="font-serif-display text-3xl font-bold text-rose-500">{score.w}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Draws</p>
          <p className="font-serif-display text-3xl font-bold">{score.d}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Me</p>
          <p className="font-serif-display text-3xl font-bold text-rose-500">{score.l}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-around">
        <motion.div
          key={player?.name}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl"
        >
          {player?.emoji || "❓"}
        </motion.div>
        <div className="text-2xl text-rose-500">vs</div>
        <motion.div
          key={computer?.name}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl"
        >
          {computer?.emoji || "❓"}
        </motion.div>
      </div>

      {result && (
        <p className="mb-4 text-center text-sm font-medium text-rose-500">
          {result === "win" && "You win! 🎉"}
          {result === "lose" && "I win! 😏"}
          {result === "draw" && "Draw! 💕"}
        </p>
      )}

      <div className="flex justify-center gap-3">
        {choices.map((c) => (
          <motion.button
            key={c.name}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => play(c)}
            className="grid h-16 w-16 place-items-center rounded-2xl glass text-3xl hover:bg-rose-500/10"
          >
            {c.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function SpinWheel() {
  const options = [
    "Kiss 💋",
    "Hug 🤗",
    "Date night 🌹",
    "Slow dance 💃",
    "Cook together 👨‍🍳",
    "Movie marathon 🍿",
    "Stargaze ✨",
    "Write a love note 💌",
  ];
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const winnerIdx = Math.floor(Math.random() * options.length);
    const segment = 360 / options.length;
    // pointer at top (0deg), so we rotate to bring winner segment to top
    const target = 360 * 6 + (360 - winnerIdx * segment - segment / 2);
    setRotation(target);
    setTimeout(() => {
      setResult(options[winnerIdx]);
      setSpinning(false);
      fireConfetti();
    }, 4500);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-64 sm:h-72 sm:w-72">
        {/* Pointer */}
        <div className="absolute left-1/2 top-[-8px] z-10 -translate-x-1/2 text-2xl">🔻</div>
        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full rounded-full border-8 border-rose-500 shadow-glow"
          style={{
            background: `conic-gradient(${options
              .map((_, i) => {
                const seg = 360 / options.length;
                const hue = i * (360 / options.length);
                return `hsl(${hue}, 70%, 70%) ${i * seg}deg ${(i + 1) * seg}deg`;
              })
              .join(", ")})`,
          }}
        >
          {options.map((opt, i) => {
            const seg = 360 / options.length;
            const angle = i * seg + seg / 2;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-left text-xs font-medium text-white"
                style={{ transform: `rotate(${angle}deg) translateX(40px)` }}
              >
                <div style={{ transform: `rotate(90deg)` }} className="whitespace-nowrap">
                  {opt}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      {result && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 text-center text-lg font-medium text-rose-500"
        >
          {result}
        </motion.p>
      )}
    </div>
  );
}

export function LoveQuiz() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = loveQuizQuestions[idx];

  const answer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) {
      setScore((s) => s + 1);
      fireConfetti();
    }
    setTimeout(() => {
      if (idx + 1 < loveQuizQuestions.length) {
        setIdx(idx + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 1500);
  };

  const reset = () => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="mb-3 text-5xl">🏆</div>
        <p className="font-serif-display text-3xl font-bold text-rose-500">
          {score} / {loveQuizQuestions.length}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {score === loveQuizQuestions.length
            ? "Perfect! You know us perfectly ❤️"
            : "Aww, you know us well! Let's play again 💕"}
        </p>
        <button
          onClick={reset}
          className="mt-4 flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/20 mx-auto"
        >
          <RotateCcw size={12} /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Question {idx + 1} / {loveQuizQuestions.length}
        </p>
        <p className="text-xs text-rose-500">Score: {score}</p>
      </div>
      <div className="mb-2 h-1 overflow-hidden rounded-full bg-rose-500/20">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all"
          style={{ width: `${((idx + 1) / loveQuizQuestions.length) * 100}%` }}
        />
      </div>
      <h4 className="mt-4 font-serif-display text-lg font-bold">{q.question}</h4>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt: string, i: number) => {
          const isSelected = selected === i;
          const isCorrect = i === q.answer;
          const showResult = selected !== null;
          return (
            <motion.button
              key={i}
              whileHover={!showResult ? { scale: 1.02 } : undefined}
              whileTap={!showResult ? { scale: 0.98 } : undefined}
              onClick={() => answer(i)}
              disabled={showResult}
              className={cn(
                "rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all",
                !showResult && "glass hover:bg-rose-500/10",
                showResult && isCorrect && "bg-green-500/20 text-green-700 dark:text-green-300",
                showResult && isSelected && !isCorrect && "bg-red-500/20 text-red-700 dark:text-red-300",
                showResult && !isSelected && !isCorrect && "opacity-50"
              )}
            >
              {opt}
              {showResult && isCorrect && " ✓"}
              {showResult && isSelected && !isCorrect && " ✗"}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function WouldYouRather() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * wouldYouRather.length));
  const [pick, setPick] = useState<"a" | "b" | null>(null);

  const next = () => {
    setPick(null);
    let n = idx;
    while (n === idx) n = Math.floor(Math.random() * wouldYouRather.length);
    setIdx(n);
  };

  const choose = (c: "a" | "b") => {
    setPick(c);
    fireConfetti();
  };

  return (
    <div>
      <p className="mb-6 text-center text-xs uppercase tracking-wider text-rose-500/70">
        Would you rather...
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => choose("a")}
          className={cn(
            "rounded-3xl p-6 text-center transition-all",
            pick === "a" ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow" : "glass hover:bg-rose-500/10",
            pick === "b" && "opacity-50"
          )}
        >
          <p className="text-lg font-medium">{wouldYouRather[idx].optionA}</p>
          {pick === "a" && <p className="mt-2 text-xs uppercase tracking-wider opacity-80">Your choice ❤️</p>}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => choose("b")}
          className={cn(
            "rounded-3xl p-6 text-center transition-all",
            pick === "b" ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow" : "glass hover:bg-rose-500/10",
            pick === "a" && "opacity-50"
          )}
        >
          <p className="text-lg font-medium">{wouldYouRather[idx].optionB}</p>
          {pick === "b" && <p className="mt-2 text-xs uppercase tracking-wider opacity-80">Your choice ❤️</p>}
        </motion.button>
      </div>

      <button
        onClick={next}
        className="mt-6 flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/20 mx-auto"
      >
        <RotateCcw size={12} /> Next Question
      </button>
    </div>
  );
}
