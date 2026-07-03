"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Upload, X, GripVertical, ImagePlus, Trash2, ZoomIn, Heart } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { uploadToStorage } from "@/lib/supabase-data";
import { useResolvedSrc } from "@/hooks/use-resolved-src";
import { cn } from "@/lib/utils";

/**
 * Apple-Photos-style photo upload + manager.
 * - Drag & drop
 * - Click to upload
 * - Multi-image selection
 * - Preview grid with reorder (drag handle)
 * - Remove
 * - Fullscreen preview with zoom
 *
 * Uploaded images are converted to object URLs (blob:) and added to the
 * Zustand store. They persist for the session (and survive refresh via the
 * LocalStorage mirror, though blob URLs are session-scoped by the browser).
 *
 * To plug a backend in later: replace `addPhoto` calls with an upload
 * request and use the returned URL. The UI stays the same.
 */
export function PhotoManager({ onClose }: { onClose: () => void }) {
  const gallery = useContentStore((s) => s.gallery);
  const addPhotos = useContentStore((s) => s.addPhotos);
  const removePhoto = useContentStore((s) => s.removePhoto);
  const reorderPhotos = useContentStore((s) => s.reorderPhotos);
  const updatePhoto = useContentStore((s) => s.updatePhoto);

  const [dragOver, setDragOver] = useState(false);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (arr.length === 0) return;
      setUploading(true);
      // Upload each file to Supabase Storage (or fall back to blob URL)
      const newPhotos = await Promise.all(
        arr.map(async (file) => ({
          src: await uploadToStorage(file, "photos"),
          caption: "",
          category: "Selfies",
          album: "Default",
        }))
      );
      addPhotos(newPhotos);
      setUploading(false);
    },
    [addPhotos]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif-display text-2xl font-bold">Photo Manager</h3>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to upload. Reorder by dragging.
          </p>
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
        >
          <X size={16} />
        </button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative mb-4 cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all",
          dragOver
            ? "border-rose-500 bg-rose-500/10"
            : "border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/5"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <motion.div
          animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
          className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow"
        >
          <Upload size={22} />
        </motion.div>
        <p className="text-sm font-medium">
          {uploading ? "Adding photos..." : "Drop photos here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, WebP — multi-select supported
        </p>
        {uploading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {gallery.photos.length === 0 ? (
          <div className="grid h-40 place-items-center rounded-2xl bg-rose-500/5 text-sm text-muted-foreground">
            <div className="text-center">
              <ImagePlus size={28} className="mx-auto mb-2 text-rose-500/50" />
              No photos yet — add your first above.
            </div>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={gallery.photos}
            onReorder={(newOrder) => {
              for (let i = 0; i < newOrder.length; i++) {
                if (newOrder[i].id !== gallery.photos[i].id) {
                  reorderPhotos(gallery.photos[i].id, newOrder[i].id);
                  break;
                }
              }
            }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {gallery.photos.map((photo, idx) => (
              <Reorder.Item
                key={photo.id}
                value={photo}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-rose-500/5"
                whileDrag={{ scale: 1.05, zIndex: 30 }}
              >
                <PhotoThumb photo={photo} />
                <div className="absolute left-1 top-1 grid h-7 w-7 cursor-grab place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
                  <GripVertical size={14} />
                </div>
                <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewIdx(idx);
                    }}
                    aria-label="Preview"
                    className="grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <ZoomIn size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    aria-label="Remove"
                    className="grid h-7 w-7 place-items-center rounded-full bg-red-500/80 text-white hover:bg-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
                  placeholder="Add caption..."
                  className="absolute inset-x-1 bottom-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white placeholder:text-white/50 outline-none backdrop-blur"
                  onClick={(e) => e.stopPropagation()}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
        <Heart size={10} className="text-rose-500" fill="currentColor" strokeWidth={0} />
        {gallery.photos.length} photo{gallery.photos.length !== 1 ? "s" : ""} • Saved for this session
      </p>

      <AnimatePresence>
        {previewIdx !== null && gallery.photos[previewIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setPreviewIdx(null);
              setZoomed(false);
            }}
            className="fixed inset-0 z-[180] grid place-items-center bg-black/90 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: zoomed ? 1.4 : 1 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw]"
            >
              <PreviewImage src={gallery.photos[previewIdx].src} alt={gallery.photos[previewIdx].caption || "Photo"} />
            </motion.div>
            <div className="absolute right-4 top-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setZoomed((z) => !z)}
                aria-label="Zoom"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => {
                  setPreviewIdx(null);
                  setZoomed(false);
                }}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>
            {gallery.photos[previewIdx].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white">
                {gallery.photos[previewIdx].caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper components that resolve idb:// URLs

function PhotoThumb({ photo }: { photo: { src: string; caption: string } }) {
  const resolved = useResolvedSrc(photo.src);
  if (!resolved) return <div className="h-full w-full bg-rose-500/10" />;
  return (
     
    <img
      src={resolved}
      alt={photo.caption || "Photo"}
      className="h-full w-full object-cover"
    />
  );
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const resolved = useResolvedSrc(src);
  if (!resolved) return <div className="max-h-[85vh] max-w-[90vw]" />;
  return (
     
    <img
      src={resolved}
      alt={alt}
      className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
    />
  );
}
