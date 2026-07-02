"use client";

import { motion } from "framer-motion";
import { memoryItems } from "@/data/memories";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";

export function MemoryWall() {
  return (
    <SectionWrapper id="memories">
      <SectionHeading
        eyebrow="Pieces of Us"
        title={<>Memory <span className="text-gradient-romantic">Wall</span></>}
        subtitle="Polaroids, sticky notes, doodles — pinned to a wall only we can see."
      />

      <div className="relative mt-14 min-h-[640px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/40 to-pink-100/40 p-4 dark:from-rose-950/30 dark:to-pink-950/30 sm:p-8">
        {/* subtle paper texture via radial dots */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.65 0.22 350 / 0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {memoryItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: item.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.06, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
            className="absolute z-10"
            style={{
              top: item.top,
              left: item.left,
              width: item.type === "polaroid" ? item.width : undefined,
            }}
          >
            {item.type === "polaroid" && (
              <div className="polaroid rounded-sm">
                { }
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="block h-44 w-full object-cover"
                />
                <p className="mt-2 text-center font-script text-sm text-gray-700">{item.caption}</p>
              </div>
            )}

            {item.type === "sticky" && (
              <div
                className="sticky-note min-h-[100px] w-40 p-3 pt-4"
                style={{ background: item.color }}
              >
                <p className="font-script text-sm leading-snug text-gray-800">{item.text}</p>
              </div>
            )}

            {item.type === "doodle" && (
              <div
                className="select-none"
                style={{ fontSize: item.size, lineHeight: 1 }}
              >
                {item.emoji}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
