// Memory wall — Pinterest-style board of polaroids, sticky notes, doodles.
export type MemoryItem =
  | { type: "polaroid"; id: string; src: string; caption: string; rotate: number; top: string; left: string; width: string }
  | { type: "sticky"; id: string; text: string; color: string; rotate: number; top: string; left: string }
  | { type: "doodle"; id: string; emoji: string; rotate: number; top: string; left: string; size: string };

export const memoryItems: MemoryItem[] = [
  { type: "polaroid", id: "m1", src: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=300&h=300&fit=crop", caption: "first kiss 💌", rotate: -6, top: "5%", left: "5%", width: "180px" },
  { type: "polaroid", id: "m2", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad5c4c?w=300&h=300&fit=crop", caption: "first date 🌹", rotate: 5, top: "8%", left: "62%", width: "180px" },
  { type: "sticky", id: "m3", text: "you + me = forever", color: "oklch(0.95 0.12 90)", rotate: 3, top: "30%", left: "30%" },
  { type: "sticky", id: "m4", text: "remember: coffee, kiss, repeat ☕", color: "oklch(0.9 0.14 60)", rotate: -4, top: "55%", left: "12%" },
  { type: "polaroid", id: "m5", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop", caption: "beach day 🌊", rotate: 8, top: "40%", left: "45%", width: "180px" },
  { type: "doodle", id: "m6", emoji: "❤️", rotate: -10, top: "20%", left: "35%", size: "60px" },
  { type: "polaroid", id: "m7", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop", caption: "us, always", rotate: -3, top: "62%", left: "55%", width: "180px" },
  { type: "sticky", id: "m8", text: "you're my favorite hello 💕", color: "oklch(0.9 0.12 350)", rotate: 6, top: "78%", left: "30%" },
  { type: "doodle", id: "m9", emoji: "✨", rotate: 12, top: "48%", left: "78%", size: "50px" },
  { type: "polaroid", id: "m10", src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop", caption: "best hugs 🤗", rotate: 4, top: "82%", left: "55%", width: "180px" },
  { type: "doodle", id: "m11", emoji: "💕", rotate: -8, top: "70%", left: "82%", size: "55px" },
  { type: "sticky", id: "m12", text: "i love you more than coffee (and that's saying a lot) ☕❤️", color: "oklch(0.9 0.14 140)", rotate: -2, top: "12%", left: "38%" },
  { type: "polaroid", id: "m13", src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=300&h=300&fit=crop", caption: "caught laughing 😂", rotate: -7, top: "35%", left: "72%", width: "180px" },
  { type: "doodle", id: "m14", emoji: "🦋", rotate: 6, top: "88%", left: "8%", size: "48px" },
];
