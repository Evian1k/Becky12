"use client";

import { useEffect, useState } from "react";

// Returns true once mounted on the client; used to avoid hydration mismatches
// for time-sensitive or random-content components.
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
