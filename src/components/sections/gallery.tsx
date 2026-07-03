"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play, Pause, Maximize2, ImagePlus } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { SmartImage } from "@/components/shared/smart-media";
import { cn } from "@/lib/utils";

export function Gallery({ onOpenManager }: { onOpenManager: () => void }) {
  const gallery = useContentStore((s) => s.gallery);
  const markPhotoViewed = useContentStore((s) => s.markPhotoViewed);
  const [category, setCategory] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const categories = ["All", ...gallery.categories];
  // Filter out photos with empty/invalid src to prevent broken images
  const allPhotos = gallery.photos.filter((p) => p.src && p.src.length > 5);
  const photos = category === "All" ? allPhotos : allPhotos.filter((p) => p.category === category);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setAutoPlay(false);
    setZoomed(false);
  }, []);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? i : (i + 1) % photos.length));
    setZoomed(false);
  }, [photos.length]);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    setZoomed(false);
  }, [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, next, prev, closeLightbox]);

  useEffect(() => {
    if (!autoPlay || lightbox === null) return;
    const id = setInterval(() => next(), 3500);
    return () => clearInterval(id);
  }, [autoPlay, lightbox, next]);

  const touchStartX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
    touchStartX.current = null;
  }

  return (
    <SectionWrapper id="gallery">
      <SectionHeading
        eyebrow="Captured Moments"
        title={<>Love <span className="text-gradient-romantic">Gallery</span></>}
        subtitle="Every photo is a tiny piece of forever — frozen in time, glowing with us."
      />

      {gallery.photos.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No photos yet"
            description="Add your first photos via the Content Manager. Drag & drop, multi-select, and reorder with ease."
            action="Add Photos"
            onAction={onOpenManager}
            icon={<ImagePlus size={26} />}
          />
        </div>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm",
                  category === cat
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow"
                    : "glass text-foreground/70 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => { setLightbox(i); markPhotoViewed(photos[i].id); }}
                className="group relative block w-full overflow-hidden rounded-2xl shadow-lg"
              >
                <SmartImage src={p.src} alt={p.caption} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {p.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <p className="text-xs font-medium text-white">{p.caption}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-rose-300">{p.category}</p>
                  </div>
                )}
                <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-white">
                <p className="text-sm font-medium">{photos[lightbox].caption || "Photo"}</p>
                <p className="text-xs text-rose-300">{lightbox + 1} / {photos.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setAutoPlay((a) => !a)} aria-label="Toggle slideshow" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  {autoPlay ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={() => setZoomed((z) => !z)} aria-label="Zoom" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <Maximize2 size={16} />
                </button>
                <button onClick={closeLightbox} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <X size={18} />
                </button>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
              <ChevronLeft size={22} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
              <ChevronRight size={22} />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: zoomed ? 1.4 : 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="max-h-[85vh] max-w-[90vw] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage src={photos[lightbox].src} alt={photos[lightbox].caption} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
