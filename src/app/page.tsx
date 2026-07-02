"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { FloatingHearts } from "@/components/shared/floating-hearts";
import { ParticleField } from "@/components/shared/particle-field";
import { EasterEggs } from "@/components/shared/easter-eggs";
import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { OurStory } from "@/components/sections/our-story";
import { Gallery } from "@/components/sections/gallery";
import { MemoryWall } from "@/components/sections/memory-wall";
import { Timeline } from "@/components/sections/timeline";
import { BucketListSection } from "@/components/sections/bucket-list";
import { Reasons } from "@/components/sections/reasons";
import { Letters } from "@/components/sections/letters";
import { Playlist } from "@/components/sections/playlist";
import { Streak } from "@/components/sections/streak";
import { CoupleCalendar } from "@/components/sections/couple-calendar";
import { DailyQuote } from "@/components/sections/daily-quote";
import { FutureDreams } from "@/components/sections/future-dreams";
import { Games } from "@/components/sections/games";
import { Footer } from "@/components/sections/footer";
import { ContentManager } from "@/components/content/content-manager";
import { useBackgroundMusic } from "@/hooks/use-background-music";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const { playing, toggle } = useBackgroundMusic();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openManager = () => setManagerOpen(true);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {mounted && <LoadingScreen />}

      <ParticleField />
      <FloatingHearts count={16} />

      <div className="pointer-events-none fixed inset-0 z-[-1] bg-aurora opacity-50 dark:opacity-70" />
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-gradient-to-b from-rose-50/40 via-transparent to-rose-100/30 dark:from-rose-950/40 dark:via-transparent dark:to-rose-950/40" />

      <Navigation onOpenManager={openManager} />

      <Hero onPlayMusic={toggle} musicPlaying={playing} onOpenManager={openManager} />

      <OurStory onOpenManager={openManager} />
      <Gallery onOpenManager={openManager} />
      <MemoryWall onOpenManager={openManager} />
      <Timeline onOpenManager={openManager} />
      <BucketListSection onOpenManager={openManager} />
      <Reasons onOpenManager={openManager} />
      <Letters onOpenManager={openManager} />
      <Playlist onOpenManager={openManager} />
      <Streak />
      <CoupleCalendar />
      <DailyQuote onOpenManager={openManager} />
      <FutureDreams onOpenManager={openManager} />
      <Games />

      <Footer />

      <EasterEggs />

      <AnimatePresence>
        {managerOpen && <ContentManager onClose={() => setManagerOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}
