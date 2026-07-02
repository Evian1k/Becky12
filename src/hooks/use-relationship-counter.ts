"use client";

import { useEffect, useState } from "react";

export type Duration = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
};

function computeDuration(from: Date, to: Date): Duration {
  const diff = Math.max(0, to.getTime() - from.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);

  // Calendrical years / months based on the actual `from` date.
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days, hours, minutes, seconds, totalDays };
}

export function useRelationshipCounter(anniversaryDate: string) {
  const [duration, setDuration] = useState<Duration | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const from = new Date(anniversaryDate);
    const update = () => {
      const nowDate = new Date();
      setDuration(computeDuration(from, nowDate));
      setNow(nowDate);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [anniversaryDate]);

  return { duration, now };
}
