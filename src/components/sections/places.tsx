"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, X, Calendar, Image as ImageIcon } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }); } catch { return ""; }
}

// Simple SVG world map (continents as abstract blobs). Each place is plotted
// by lat/lng onto a 0-100 x/y grid using equirectangular projection.
function WorldMap({ places, onSelect }: { places: any[]; onSelect: (id: string) => void }) {
  // Equirectangular: x = (lng + 180) / 360 * 100, y = (90 - lat) / 180 * 100
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-4">
      <svg viewBox="0 0 100 50" className="w-full" style={{ aspectRatio: "2 / 1" }}>
        {/* Stylized continents (very simplified blobs) */}
        <g fill="oklch(0.7 0.05 200 / 0.3)" stroke="oklch(0.7 0.05 200 / 0.5)" strokeWidth="0.2">
          {/* North America */}
          <path d="M10,12 Q15,8 22,10 Q26,12 25,18 Q22,22 18,22 Q12,20 10,15 Z" />
          {/* South America */}
          <path d="M22,25 Q26,24 28,28 Q29,35 26,40 Q23,42 22,38 Q20,32 22,25 Z" />
          {/* Europe */}
          <path d="M45,12 Q50,10 53,13 Q52,16 48,17 Q45,15 45,12 Z" />
          {/* Africa */}
          <path d="M47,20 Q54,18 56,24 Q55,32 52,38 Q48,40 46,34 Q44,26 47,20 Z" />
          {/* Asia */}
          <path d="M55,10 Q70,8 80,12 Q85,16 82,22 Q72,22 62,18 Q56,15 55,10 Z" />
          {/* Australia */}
          <path d="M78,32 Q85,30 88,34 Q87,38 82,38 Q78,36 78,32 Z" />
        </g>

        {/* Place markers */}
        {places.map((p, i) => {
          if (typeof p.lat !== "number" || typeof p.lng !== "number") return null;
          const x = ((p.lng + 180) / 360) * 100;
          const y = ((90 - p.lat) / 180) * 50;
          return (
            <motion.g
              key={p.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              onClick={() => onSelect(p.id)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={x} cy={y} r={1.2}
                fill="#ff4d6d"
                animate={{ r: [1.2, 1.8, 1.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
              <circle cx={x} cy={y} r={3} fill="none" stroke="#ff4d6d" strokeWidth="0.3" opacity="0.4" />
              <text x={x} y={y - 2} fontSize="1.5" fill="#ff4d6d" textAnchor="middle" className="font-medium">
                {p.emoji || "📍"}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        {places.length} place{places.length !== 1 ? "s" : ""} visited together
      </p>
    </div>
  );
}

export function Places({ onOpenManager }: { onOpenManager: () => void }) {
  const places = useContentStore((s) => s.places);
  const removePlace = useContentStore((s) => s.removePlace);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedPlace = places.find((p) => p.id === selected);

  return (
    <SectionWrapper id="places">
      <SectionHeading
        eyebrow="Where We've Been"
        title={<>Our <span className="text-gradient-romantic">Places</span></>}
        subtitle="Every place we've been together — pinned on a map that grows with us."
      />

      {places.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No places yet"
            description="Add the places you've visited together — cities, restaurants, parks, anywhere that means something."
            action="Add First Place"
            onAction={onOpenManager}
            icon={<MapPin size={26} />}
          />
        </div>
      ) : (
        <>
          <div className="mt-10">
            <WorldMap places={places} onSelect={setSelected} />
          </div>

          {/* Grid of place cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(p.id)}
                className="glass overflow-hidden rounded-3xl text-left"
              >
                {p.photos[0] && (
                  <div className="relative h-40 overflow-hidden">
                    { }
                    <img src={p.photos[0]} alt={p.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white backdrop-blur">
                      <MapPin size={10} /> {p.location || "Unknown"}
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-serif-display text-base font-bold">{p.name}</h3>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-rose-500/60">
                    <Calendar size={10} className="mr-1 inline" />
                    {formatDate(p.visitedDate)}
                  </p>
                  {p.story && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.story}</p>}
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* Place detail modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[150] grid place-items-center bg-black/80 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative max-h-[85vh] w-full max-w-2xl overflow-y-auto custom-scrollbar rounded-3xl p-6 sm:p-8"
            >
              <button onClick={() => setSelected(null)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-rose-500/70">
                <MapPin size={12} /> {selectedPlace.location}
              </div>
              <h3 className="mt-2 font-serif-display text-3xl font-bold">{selectedPlace.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(selectedPlace.visitedDate)}</p>

              {selectedPlace.photos.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {selectedPlace.photos.map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                      { }
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {selectedPlace.story && (
                <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{selectedPlace.story}</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    removePlace(selectedPlace.id);
                    setSelected(null);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-red-500/80 px-4 py-2 text-xs font-medium text-white hover:bg-red-600"
                >
                  <Trash2 size={12} /> Delete Place
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
