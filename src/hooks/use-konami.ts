"use client";

import { useEffect, useState } from "react";

// Triggers when user enters the Konami code:
// ↑ ↑ ↓ ↓ ← → ← → B A
export function useKonamiCode(callback: () => void) {
  useEffect(() => {
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let position = 0;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const required = sequence[position];
      if (key === required) {
        position++;
        if (position === sequence.length) {
          position = 0;
          callback();
        }
      } else {
        position = key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback]);
}
