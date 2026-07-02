"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, Heart } from "lucide-react";
import { coupleConfig } from "@/data/couple-config";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export function Playlist() {
  const songs = coupleConfig.songs;
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setCurrent((c) => (c + 1) % songs.length);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
     
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = songs[current].src;
    audio.load();
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
     
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src) audio.src = songs[current].src;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const next = () => setCurrent((c) => (c + 1) % songs.length);
  const prev = () => setCurrent((c) => (c - 1 + songs.length) % songs.length);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const song = songs[current];

  return (
    <SectionWrapper id="playlist">
      <SectionHeading
        eyebrow="Our Soundtrack"
        title={<>Our <span className="text-gradient-romantic">Playlist</span></>}
        subtitle="Songs that feel like us — every lyric a small love letter."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Player card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-6 sm:p-8"
        >
          {/* Album cover */}
          <div className="relative mx-auto aspect-square w-full max-w-xs">
            <motion.div
              animate={{ rotate: playing ? 360 : 0 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              className="h-full w-full overflow-hidden rounded-full shadow-2xl"
            >
              { }
              <img src={song.cover} alt={song.title} className="h-full w-full object-cover" />
            </motion.div>
            {/* Center hole */}
            <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-4 ring-rose-500/30" />
            {/* Pulse ring when playing */}
            {playing && (
              <motion.div
                animate={{ scale: [1, 1.1], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full ring-2 ring-rose-500"
              />
            )}
          </div>

          <div className="mt-6 text-center">
            <h3 className="font-serif-display text-2xl font-bold">{song.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{song.artist}</p>
            <p className="mt-0.5 text-xs text-rose-500/70">{song.album}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div
              onClick={seek}
              className="group relative h-1.5 w-full cursor-pointer rounded-full bg-rose-500/20"
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] tabular-nums text-muted-foreground">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={prev} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-rose-500/10 hover:text-rose-500">
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow transition-transform hover:scale-105"
            >
              {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={next} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-rose-500/10 hover:text-rose-500">
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          {/* Volume */}
          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-foreground/60 hover:text-rose-500"
            >
              {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setMuted(false);
              }}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-rose-500/20 accent-rose-500"
            />
          </div>
        </motion.div>

        {/* Song list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass rounded-3xl p-4 sm:p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold uppercase tracking-wider text-rose-500/80">
            <Music2 size={14} /> All Songs
          </h3>
          <div className="max-h-[440px] space-y-1 overflow-y-auto custom-scrollbar">
            {songs.map((s, i) => (
              <button
                key={s.title}
                onClick={() => {
                  setCurrent(i);
                  setPlaying(true);
                  setTimeout(() => audioRef.current?.play().catch(() => setPlaying(false)), 100);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                  i === current
                    ? "bg-gradient-to-r from-rose-500/20 to-pink-500/20"
                    : "hover:bg-white/5"
                )}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                  { }
                  <img src={s.cover} alt={s.title} className="h-full w-full object-cover" />
                  {i === current && playing && (
                    <div className="absolute inset-0 grid place-items-center bg-black/40">
                      <div className="flex items-end gap-0.5">
                        {[0, 1, 2].map((bar) => (
                          <motion.div
                            key={bar}
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: bar * 0.15 }}
                            className="w-1 bg-rose-400"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", i === current ? "text-rose-500" : "text-foreground")}>
                    {s.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{s.artist}</p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{s.duration}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-rose-500/5 p-3 text-xs text-muted-foreground">
            <Heart size={12} className="text-rose-500" fill="currentColor" strokeWidth={0} />
            <span>Made with love, just for us.</span>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
