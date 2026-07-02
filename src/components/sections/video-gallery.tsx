"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus, Trash2, X, Play, Upload, Heart, Search } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export function VideoGallery({ onOpenManager }: { onOpenManager: () => void }) {
  const videos = useContentStore((s) => s.videos);
  const addVideo = useContentStore((s) => s.addVideo);
  const updateVideo = useContentStore((s) => s.updateVideo);
  const removeVideo = useContentStore((s) => s.removeVideo);
  const [playing, setPlaying] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith("video/"));
      if (arr.length === 0) return;
      setUploading(true);
      arr.forEach((file) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = url;
        video.addEventListener("loadeddata", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 180;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          addVideo({
            src: url,
            title: file.name.replace(/\.[^.]+$/, ""),
            description: "",
            thumbnail: canvas.toDataURL("image/jpeg", 0.7),
          });
        });
      });
      setTimeout(() => setUploading(false), 800);
    },
    [addVideo]
  );

  const filtered = videos.filter((v) => !search || v.title.toLowerCase().includes(search.toLowerCase()));

  if (videos.length === 0) {
    return (
      <SectionWrapper id="videos">
        <SectionHeading
          eyebrow="Moving Memories"
          title={<>Video <span className="text-gradient-romantic">Gallery</span></>}
          subtitle="The moments photos can't capture — laughs, dances, the way we move together."
        />
        <div className="mt-10">
          <EmptyState
            title="No videos yet"
            description="Upload MP4, MOV, or WebM files. Beautiful moments deserve to be moving."
            action="Upload First Video"
            onAction={() => fileRef.current?.click()}
            icon={<Video size={26} />}
          />
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="videos">
      <SectionHeading
        eyebrow="Moving Memories"
        title={<>Video <span className="text-gradient-romantic">Gallery</span></>}
        subtitle="The moments photos can't capture — laughs, dances, the way we move together."
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full rounded-full border border-rose-500/20 bg-background/50 px-9 py-2 text-sm outline-none focus:border-rose-500"
          />
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow"
        >
          <Plus size={12} /> Add Video
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-rose-500/10 p-3 text-xs text-rose-500"
        >
          <Upload size={12} className="animate-bounce" /> Processing videos...
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl glass"
          >
            <button
              onClick={() => setPlaying(v.id)}
              className="relative block aspect-video w-full"
            >
              {v.thumbnail ? (
                 
                <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-500">
                  <Video size={32} />
                </div>
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/20 backdrop-blur">
                  <Play size={20} fill="currentColor" className="ml-1 text-white" />
                </div>
              </div>
            </button>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="flex-1 font-serif-display text-base font-bold">{v.title}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateVideo(v.id, { favorite: !v.favorite })}
                    aria-label="Favorite"
                    className={cn("grid h-7 w-7 place-items-center rounded-full", v.favorite ? "bg-rose-500 text-white" : "bg-rose-500/10 text-rose-500")}
                  >
                    <Heart size={12} fill="currentColor" strokeWidth={0} />
                  </button>
                  <button
                    onClick={() => removeVideo(v.id)}
                    aria-label="Delete"
                    className="grid h-7 w-7 place-items-center rounded-full bg-red-500/80 text-white hover:bg-red-600"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              {v.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{v.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen video player */}
      <AnimatePresence>
        {playing && (() => {
          const v = videos.find((x) => x.id === playing);
          if (!v) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlaying(null)}
              className="fixed inset-0 z-[150] grid place-items-center bg-black/90 p-4 backdrop-blur-xl"
            >
              <button onClick={() => setPlaying(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <X size={18} />
              </button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl"
              >
                <video
                  src={v.src}
                  controls
                  autoPlay
                  className="w-full rounded-2xl"
                  poster={v.thumbnail}
                />
                <div className="mt-4 text-center text-white">
                  <h3 className="font-serif-display text-xl font-bold">{v.title}</h3>
                  {v.description && <p className="mt-1 text-sm text-white/70">{v.description}</p>}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </SectionWrapper>
  );
}
