"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { FloatingHearts } from "@/components/shared/floating-hearts";
import { ParticleField } from "@/components/shared/particle-field";
import { EasterEggs } from "@/components/shared/easter-eggs";
import { ScrollProgress, Reveal } from "@/components/shared/animations";
import { SectionDivider } from "@/components/shared/parallax";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { Gallery } from "@/components/sections/gallery";
import { VideoGallery } from "@/components/sections/video-gallery";
import { Timeline } from "@/components/sections/timeline";
import { Journal } from "@/components/sections/journal";
import { Letters } from "@/components/sections/letters";
import { Playlist } from "@/components/sections/playlist";
import { DailyQuote } from "@/components/sections/daily-quote";
import { BucketListSection } from "@/components/sections/bucket-list";
import { Streak } from "@/components/sections/streak";
import { CoupleCalendar } from "@/components/sections/couple-calendar";
import { SpecialDates } from "@/components/sections/special-dates";
import { Places } from "@/components/sections/places";
import { Achievements } from "@/components/sections/achievements";
import { Games } from "@/components/sections/games";
import { Profile } from "@/components/sections/profile";
import { SettingsSection } from "@/components/sections/settings-section";
import { Footer } from "@/components/sections/footer";
import { ContentManager } from "@/components/content/content-manager";
import { AuthScreen } from "@/components/auth/auth-screen";
import { useBackgroundMusic } from "@/hooks/use-background-music";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const { playing, toggle } = useBackgroundMusic();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openManager = () => setManagerOpen(true);

  if (mounted && loading) return <LoadingScreen />;
  if (!user) return <AuthScreen />;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <ScrollProgress />
      <CursorGlow />
      <ParticleField />
      <FloatingHearts count={16} />

      <div className="pointer-events-none fixed inset-0 z-[-1] bg-aurora opacity-50 dark:opacity-70" />
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-gradient-to-b from-rose-50/40 via-transparent to-rose-100/30 dark:from-rose-950/40 dark:via-transparent dark:to-rose-950/40" />

      <Navigation onOpenManager={openManager} onSignOut={signOut} />

      <Hero onPlayMusic={toggle} musicPlaying={playing} onOpenManager={openManager} />

      <Reveal><Gallery onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><VideoGallery onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><Timeline onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><Journal onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><Letters onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><Playlist onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><DailyQuote onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><BucketListSection onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><Streak /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><CoupleCalendar /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><SpecialDates onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><Places onOpenManager={openManager} /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><Achievements /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><Games /></Reveal>
      <SectionDivider icon="sparkle" />

      <Reveal><Profile /></Reveal>
      <SectionDivider icon="heart" />

      <Reveal><SettingsSection /></Reveal>

      <Footer />

      <EasterEggs />

      <AnimatePresence>
        {managerOpen && <ContentManager onClose={() => setManagerOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}
