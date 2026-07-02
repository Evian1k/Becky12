"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { id: "home", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "gallery", label: "Gallery" },
  { id: "memories", label: "Memories" },
  { id: "timeline", label: "Timeline" },
  { id: "bucket-list", label: "Bucket List" },
  { id: "reasons", label: "Reasons I Love You" },
  { id: "letters", label: "Letters" },
  { id: "playlist", label: "Playlist" },
  { id: "games", label: "Games" },
  { id: "future", label: "Future" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // Track active section
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
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            <Heart size={14} className="text-rose-500 animate-heartbeat" fill="currentColor" strokeWidth={0} />
            <span className="font-script text-lg">Our Forever</span>
          </button>

          {/* Desktop nav */}
          <div
            className={cn(
              "hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex transition-all duration-500",
              scrolled ? "glass" : "glass-strong"
            )}
          >
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active === l.id
                    ? "text-white"
                    : "text-foreground/70 hover:text-foreground"
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

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong absolute inset-x-4 top-24 rounded-3xl p-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {links.map((l, i) => (
                  <motion.button
                    key={l.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => scrollTo(l.id)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors",
                      active === l.id
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {l.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
