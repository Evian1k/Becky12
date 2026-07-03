"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Settings, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { GlobalSearch } from "@/components/shared/global-search";
import { NotificationsBell } from "@/components/shared/notifications-bell";
import { SmartImage } from "@/components/shared/smart-media";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const links = [
  { id: "home", label: "Home" },
  { id: "gallery", label: "Gallery" },
  { id: "videos", label: "Videos" },
  { id: "timeline", label: "Timeline" },
  { id: "journal", label: "Journal" },
  { id: "letters", label: "Letters" },
  { id: "playlist", label: "Playlist" },
  { id: "quotes", label: "Quotes" },
  { id: "bucket-list", label: "Bucket List" },
  { id: "calendar", label: "Calendar" },
  { id: "places", label: "Places" },
  { id: "achievements", label: "Achievements" },
  { id: "games", label: "Games" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export function Navigation({ onOpenManager, onSignOut }: { onOpenManager: () => void; onSignOut: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const offsets = links
        .map((l) => {
          const el = document.getElementById(l.id);
          if (!el) return null;
          return { id: l.id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean) as { id: string; top: number }[];
      const current = offsets.find((o) => o.top > -50 && o.top < window.innerHeight * 0.5);
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed inset-x-0 top-0 z-[100] transition-all duration-500", scrolled ? "py-3" : "py-5")}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollTo("home")}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            <Heart size={14} className="text-rose-500 animate-heartbeat" fill="currentColor" strokeWidth={0} />
            <span className="font-script text-lg">Our Forever</span>
          </button>

          <div className={cn("hidden items-center gap-1 rounded-full px-2 py-1.5 2xl:flex transition-all duration-500", scrolled ? "glass" : "glass-strong")}>
            {links.slice(0, 12).map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active === l.id ? "text-white" : "text-foreground/70 hover:text-foreground"
                )}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <GlobalSearch />
            <NotificationsBell />
            <button
              onClick={onOpenManager}
              aria-label="Open Content Manager"
              className="glass hidden h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 lg:flex"
            >
              <Settings size={12} />
              <span className="hidden xl:inline">Edit</span>
            </button>
            {user && (
              <button
                onClick={onSignOut}
                aria-label="Sign out"
                className="glass hidden h-9 w-9 place-items-center rounded-full text-foreground/80 hover:text-red-500 sm:grid"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            )}
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="glass grid h-9 w-9 place-items-center rounded-full 2xl:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] 2xl:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong absolute inset-x-2 top-20 max-h-[85vh] overflow-y-auto rounded-3xl p-3 custom-scrollbar sm:inset-x-4 sm:top-24 sm:p-4"
            >
              {user && (
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-rose-500/10 p-3">
                  <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                    {user.avatar ? (
                      <SmartImage src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {links.map((l, i) => (
                  <motion.button
                    key={l.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => scrollTo(l.id)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors",
                      active === l.id ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white" : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {l.label}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => { onOpenManager(); setOpen(false); }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-500"
              >
                <Settings size={14} /> Content Manager
              </button>
              {user && (
                <button
                  onClick={() => { onSignOut(); setOpen(false); }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
