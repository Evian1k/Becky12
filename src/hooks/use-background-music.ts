"use client";

import { useEffect, useRef, useState } from "react";
import { useContentStore } from "@/lib/content-store";

/**
 * Lightweight global background music controller.
 * Plays the song marked as "Our Song" if set, otherwise the first song
 * in the playlist. If there are no songs, the play button is a no-op.
 */
export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const playlist = useContentStore((s) => s.playlist);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const ourSong = playlist.songs.find((s) => s.id === playlist.ourSongId) || playlist.songs[0];

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !ourSong) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!audio.src) audio.src = ourSong.src;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return { playing, toggle };
}
