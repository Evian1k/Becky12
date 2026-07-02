"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, X, Heart } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { cn } from "@/lib/utils";

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const typeEmoji: Record<string, string> = {
  photo: "📸",
  video: "🎥",
  song: "🎵",
  letter: "💌",
  quote: "💬",
  journal: "📔",
  timeline: "✨",
  anniversary: "🎉",
  birthday: "🎂",
  streak: "🔥",
  achievement: "🏆",
};

export function NotificationsBell() {
  const notifications = useContentStore((s) => s.notifications);
  const markRead = useContentStore((s) => s.markNotificationRead);
  const markAllRead = useContentStore((s) => s.markAllNotificationsRead);
  const remove = useContentStore((s) => s.removeNotification);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Notifications"
        className="glass relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:text-rose-500"
      >
        <Bell size={16} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-[10px] font-bold text-white"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160]"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto custom-scrollbar p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-serif-display text-xl font-bold">
                  <Bell size={16} /> Notifications
                </h3>
                <div className="flex gap-2">
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="rounded-full bg-rose-500/10 px-3 py-1.5 text-[10px] text-rose-500 hover:bg-rose-500/20"
                    >
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="mt-20 text-center text-sm text-muted-foreground">
                  <Heart size={32} className="mx-auto mb-3 text-rose-500/30" />
                  No notifications yet.
                  <p className="mt-2 text-xs">When something happens, you'll see it here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "relative rounded-2xl p-3 transition-colors",
                        n.read ? "bg-rose-500/5" : "bg-rose-500/15"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-lg">
                          {typeEmoji[n.type] || "❤️"}
                        </div>
                        <div className="flex-1 pr-6">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                          <p className="mt-1 text-[10px] text-rose-500/60">{formatRelative(n.date)}</p>
                        </div>
                        <div className="absolute right-2 top-2 flex gap-1">
                          {!n.read && (
                            <button
                              onClick={() => markRead(n.id)}
                              aria-label="Mark read"
                              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-foreground hover:bg-white/20"
                            >
                              <Check size={11} />
                            </button>
                          )}
                          <button
                            onClick={() => remove(n.id)}
                            aria-label="Delete"
                            className="grid h-6 w-6 place-items-center rounded-full bg-red-500/80 text-white hover:bg-red-600"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
