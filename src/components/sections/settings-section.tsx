"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles, Music, Bell, Heart, Save, RotateCcw, Trash2, HardDrive } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { estimateStorage } from "@/lib/indexeddb-storage";
import { cn } from "@/lib/utils";

const accentColors = [
  { name: "Rose", value: "#ff4d6d" },
  { name: "Pink", value: "#ec4899" },
  { name: "Purple", value: "#a855f7" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
];

function Toggle({ value, onChange, label, description, icon }: { value: boolean; onChange: (v: boolean) => void; label: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-rose-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-500">{icon}</div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", value ? "bg-gradient-to-r from-rose-500 to-pink-500" : "bg-muted")}
        aria-pressed={value}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}

export function SettingsSection() {
  const settings = useContentStore((s) => s.settings) || {};
  const setSettings = useContentStore((s) => s.setSettings);
  const resetAll = useContentStore((s) => s.resetAll);

  return (
    <SectionWrapper id="settings">
      <SectionHeading
        eyebrow="Make It Yours"
        title={<>Settings</>}
        subtitle="Tune the look, feel, and behavior of your little corner of the internet."
      />

      <div className="mx-auto mt-12 max-w-2xl space-y-6">
        {/* Theme color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-6"
        >
          <h4 className="flex items-center gap-2 font-serif-display text-lg font-bold">
            <Palette size={16} /> Accent Color
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">Choose the color that feels most like us.</p>
          <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-10">
            {accentColors.map((c) => (
              <button
                key={c.value}
                onClick={() => setSettings({ accentColor: c.value, themeColor: c.value })}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-110",
                  settings.accentColor === c.value && "ring-2 ring-offset-2 ring-offset-background"
                )}
                style={{ background: c.value, boxShadow: settings.accentColor === c.value ? `0 0 0 2px ${c.value}` : undefined }}
                aria-label={c.name}
              >
                {settings.accentColor === c.value && <Heart size={14} fill="white" strokeWidth={0} className="text-white" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-strong rounded-3xl p-6"
        >
          <h4 className="flex items-center gap-2 font-serif-display text-lg font-bold">
            <Sparkles size={16} /> Experience
          </h4>
          <div className="mt-4 space-y-3">
            <Toggle
              value={settings.animationsEnabled}
              onChange={(v) => setSettings({ animationsEnabled: v })}
              label="Animations"
              description="Smooth motion and transitions throughout the site"
              icon={<Sparkles size={16} />}
            />
            <Toggle
              value={settings.musicEnabled}
              onChange={(v) => setSettings({ musicEnabled: v })}
              label="Background Music"
              description="Allow background music playback"
              icon={<Music size={16} />}
            />
            <Toggle
              value={settings.notificationsEnabled}
              onChange={(v) => setSettings({ notificationsEnabled: v })}
              label="Notifications"
              description="Get notified when new content is added"
              icon={<Bell size={16} />}
            />
            <Toggle
              value={settings.floatingHeartsEnabled}
              onChange={(v) => setSettings({ floatingHeartsEnabled: v })}
              label="Floating Hearts"
              description="Romantic hearts drifting across the screen"
              icon={<Heart size={16} />}
            />
            <Toggle
              value={settings.particlesEnabled}
              onChange={(v) => setSettings({ particlesEnabled: v })}
              label="Particle Starfield"
              description="Soft twinkling stars in the background"
              icon={<Sparkles size={16} />}
            />
          </div>
        </motion.div>

        {/* Reset */}
        {/* Storage management */}
        <StorageSection />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-3xl p-6"
        >
          <h4 className="flex items-center gap-2 font-serif-display text-lg font-bold text-red-500">
            <RotateCcw size={16} /> Danger Zone
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Reset all content — photos, letters, journal entries, everything. This cannot be undone.
          </p>
          <button
            onClick={() => {
              if (confirm("Reset ALL content? This permanently deletes everything from this device.")) {
                resetAll();
              }
            }}
            className="mt-4 rounded-full bg-red-500/80 px-5 py-2 text-xs font-medium text-white hover:bg-red-600"
          >
            Reset Everything
          </button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function StorageSection() {
  const gallery = useContentStore((s) => s.gallery);
  const cleanupOldPhotos = useContentStore((s) => s.cleanupOldPhotos);
  const [storage, setStorage] = useState<{ usage: number; quota: number } | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    estimateStorage().then(setStorage);
  }, [gallery.photos.length]);

  const formatBytes = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
    return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const usagePct = storage && storage.quota > 0 ? (storage.usage / storage.quota) * 100 : 0;

  const handleCleanup = () => {
    const { deleted, remaining } = cleanupOldPhotos(30);
    if (deleted === 0) {
      setResult(`No old photos to clean up. All ${remaining} photos have been viewed recently or are favorited.`);
    } else {
      setResult(`✓ Deleted ${deleted} photo${deleted !== 1 ? "s" : ""} not viewed in 30+ days. ${remaining} photos kept (favorites + recently viewed).`);
    }
    setTimeout(() => setResult(null), 6000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-strong rounded-3xl p-6"
    >
      <h4 className="flex items-center gap-2 font-serif-display text-lg font-bold">
        <HardDrive size={16} /> Storage
      </h4>
      <p className="mt-1 text-xs text-muted-foreground">
        Manage space by removing photos you haven't looked at in a while.
      </p>

      {/* Storage usage bar */}
      {storage && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatBytes(storage.usage)} used</span>
            <span>{formatBytes(storage.quota)} total</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-rose-500/10">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                usagePct > 80 ? "bg-red-500" : usagePct > 60 ? "bg-amber-500" : "bg-gradient-to-r from-rose-500 to-pink-500"
              )}
              style={{ width: `${Math.min(usagePct, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {usagePct.toFixed(1)}% used • {gallery.photos.length} photo{gallery.photos.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Cleanup button */}
      <button
        onClick={handleCleanup}
        className="mt-4 flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/20"
      >
        <Trash2 size={12} /> Clean up photos not viewed in 30 days
      </button>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        Favorites are always kept. Auto-cleanup runs when storage is over 80% full.
      </p>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-green-500/15 px-4 py-2.5 text-xs text-green-600 dark:text-green-400"
        >
          {result}
        </motion.div>
      )}
    </motion.div>
  );
}
