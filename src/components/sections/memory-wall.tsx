"use client";

import { motion } from "framer-motion";
import { Heart, ImagePlus } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { SmartImage } from "@/components/shared/smart-media";

export function MemoryWall({ onOpenManager }: { onOpenManager: () => void }) {
  const gallery = useContentStore((s) => s.gallery);
  const notes = useContentStore((s) => s.notes);

  // Auto-build polaroids from gallery photos.
  // Filter out any photos with empty/invalid src to prevent broken images.
  const polaroids = gallery.photos
    .filter((p) => p.src && p.src.length > 5)
    .slice(0, 8)
    .map((p, i) => ({
      id: `mw-${p.id}`,
      src: p.src,
      caption: p.caption || "us",
      rotate: [-6, 5, -3, 8, -7, 4, -5, 3][i % 8],
      top: `${5 + (i % 4) * 22}%`,
      left: `${5 + (i * 17) % 75}%`,
      width: "180px",
    }));

  const stickies = notes.filter((n) => n.category === "love").slice(0, 4).map((n, i) => ({
    id: `mw-s-${n.id}`,
    text: n.text,
    color: ["oklch(0.95 0.12 90)", "oklch(0.9 0.14 60)", "oklch(0.9 0.12 350)", "oklch(0.9 0.14 140)"][i % 4],
    rotate: [3, -4, 6, -2][i % 4],
    top: `${15 + (i % 2) * 50}%`,
    left: `${30 + i * 18}%`,
  }));

  if (polaroids.length === 0 && stickies.length === 0) {
    return (
      <SectionWrapper id="memories">
        <SectionHeading
          eyebrow="Pieces of Us"
          title={<>Memory <span className="text-gradient-romantic">Wall</span></>}
          subtitle="Polaroids, sticky notes, doodles — pinned to a wall only we can see."
        />
        <div className="mt-10">
          <EmptyState
            title="No memories yet"
            description="Add photos and love notes via the Content Manager and they'll appear here on your wall."
            action="Add Memories"
            onAction={onOpenManager}
            icon={<ImagePlus size={26} />}
          />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="memories">
      <SectionHeading
        eyebrow="Pieces of Us"
        title={<>Memory <span className="text-gradient-romantic">Wall</span></>}
        subtitle="Polaroids, sticky notes, doodles — pinned to a wall only we can see."
      />

      <div className="relative mt-14 min-h-[640px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/40 to-pink-100/40 p-4 dark:from-rose-950/30 dark:to-pink-950/30 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.65 0.22 350 / 0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {polaroids.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: item.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.06, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
            className="absolute z-10"
            style={{ top: item.top, left: item.left, width: item.width }}
          >
            <div className="polaroid rounded-sm">
              <SmartImage src={item.src} alt={item.caption} loading="lazy" className="block h-44 w-full object-cover" />
              <p className="mt-2 text-center font-script text-sm text-gray-700">{item.caption}</p>
            </div>
          </motion.div>
        ))}

        {stickies.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: item.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
            className="absolute z-10"
            style={{ top: item.top, left: item.left, background: item.color }}
          >
            <div className="sticky-note min-h-[100px] w-40 p-3 pt-4">
              <p className="font-script text-sm leading-snug text-gray-800">{item.text}</p>
            </div>
          </motion.div>
        ))}

        {/* Decorative doodles */}
        <motion.div
          className="absolute z-0 select-none text-rose-500/30"
          style={{ top: "20%", left: "35%", fontSize: "60px" }}
          animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          ❤️
        </motion.div>
        <motion.div
          className="absolute z-0 select-none text-rose-500/30"
          style={{ top: "60%", left: "78%", fontSize: "50px" }}
          animate={{ y: [0, -10, 0], rotate: [12, -12, 12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
