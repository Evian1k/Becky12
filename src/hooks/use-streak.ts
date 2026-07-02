"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "our-forever-streak";

export type StreakState = {
  currentStreak: number;
  highestStreak: number;
  daysTogether: number;
  lastCheckIn: string | null; // YYYY-MM-DD
  checkIns: string[]; // array of YYYY-MM-DD
  loveSentToday: boolean;
  memoryAddedToday: boolean;
};

const initialState: StreakState = {
  currentStreak: 0,
  highestStreak: 0,
  daysTogether: 0,
  lastCheckIn: null,
  checkIns: [],
  loveSentToday: false,
  memoryAddedToday: false,
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

export function useStreak(anniversaryDate: string) {
  const [state, setState] = useState<StreakState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StreakState = JSON.parse(raw);
        // Reset daily flags if it's a new day
        const today = todayStr();
        if (parsed.lastCheckIn && parsed.lastCheckIn !== today) {
          // Check if streak was broken (more than 1 day gap)
          const gap = dayDiff(parsed.lastCheckIn, today);
          if (gap > 1) {
            parsed.currentStreak = 0;
            parsed.loveSentToday = false;
            parsed.memoryAddedToday = false;
          } else {
            // Same day rollover, reset daily flags
            parsed.loveSentToday = false;
            parsed.memoryAddedToday = false;
          }
        } else if (parsed.lastCheckIn === today) {
          // Same day, keep flags as-is
        } else {
          parsed.loveSentToday = false;
          parsed.memoryAddedToday = false;
        }
        setState(parsed);
      } else {
        // Initialize daysTogether from anniversary
        const days = Math.max(0, dayDiff(anniversaryDate.slice(0, 10), todayStr()));
        setState({ ...initialState, daysTogether: days });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [anniversaryDate]);

  const persist = useCallback((next: StreakState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const checkIn = useCallback(() => {
    const today = todayStr();
    if (state.lastCheckIn === today) return false; // already checked in
    let newStreak = 1;
    if (state.lastCheckIn) {
      const gap = dayDiff(state.lastCheckIn, today);
      newStreak = gap === 1 ? state.currentStreak + 1 : 1;
    }
    const newCheckIns = Array.from(new Set([...state.checkIns, today])).sort();
    const next: StreakState = {
      ...state,
      currentStreak: newStreak,
      highestStreak: Math.max(state.highestStreak, newStreak),
      lastCheckIn: today,
      checkIns: newCheckIns,
    };
    persist(next);
    return true;
  }, [state, persist]);

  const addMemory = useCallback(() => {
    const today = todayStr();
    if (state.memoryAddedToday) return false;
    // Add today to checkIns if not present (a memory counts as activity)
    const newCheckIns = Array.from(new Set([...state.checkIns, today])).sort();
    const next: StreakState = {
      ...state,
      memoryAddedToday: true,
      checkIns: newCheckIns,
    };
    persist(next);
    return true;
  }, [state, persist]);

  const sendLove = useCallback(() => {
    if (state.loveSentToday) return false;
    const next: StreakState = {
      ...state,
      loveSentToday: true,
    };
    persist(next);
    return true;
  }, [state, persist]);

  return { state, hydrated, checkIn, addMemory, sendLove };
}

export function getCalendarCheckIns(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: StreakState = JSON.parse(raw);
    const map: Record<string, boolean> = {};
    parsed.checkIns.forEach((d) => (map[d] = true));
    return map;
  } catch {
    return {};
  }
}
