"use client";

import { useEffect, useRef, useState } from "react";
import { coupleConfig } from "@/data/couple-config";

/**
 * Lightweight global background music controller.
 * No UI — used by the hero play button. Pulls the first song from config.
 */
export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(coupleConfig.songs[0].src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Autoplay may be blocked; user can retry.
        setPlaying(false);
      });
    }
  };

  return { playing, toggle };
}
