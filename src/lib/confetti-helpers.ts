"use client";

import confetti from "canvas-confetti";

/**
 * Romantic confetti helper — hearts + pink/rose color palette.
 */
export function fireConfetti() {
  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0.7,
    decay: 0.94,
    startVelocity: 35,
    shapes: ["circle" as const],
    colors: ["#ff4d6d", "#ff8fa3", "#ffb3c1", "#ffc9d9", "#ffffff"],
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 50,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.5 },
    });
    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 0.9,
      origin: { x: 0.5, y: 0.5 },
    });
  };

  shoot();
  setTimeout(shoot, 150);
  setTimeout(shoot, 300);
}

export function fireFireworks() {
  const duration = 2000;
  const end = Date.now() + duration;
  const colors = ["#ff4d6d", "#ff8fa3", "#ffb3c1", "#ffd700", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function fireHearts() {
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });
  confetti({
    scalar: 2,
    spread: 120,
    ticks: 100,
    gravity: 0.6,
    decay: 0.92,
    startVelocity: 35,
    shapes: [heart],
    particleCount: 30,
    origin: { x: 0.5, y: 0.4 },
  });
}
