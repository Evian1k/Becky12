# Our Forever ❤️

A premium, fully-functional, private couple website. Real auth, real-time sync, cloud storage — all powered by Supabase. Falls back to LocalStorage-only mode when Supabase isn't configured, so it always works.

## ✨ Features

### Authentication
- Real Supabase Auth (JWT, bcrypt, secure sessions)
- Register / Login / Logout
- Forgot Password (email-based reset via Supabase)
- Change Password
- Profile Picture + Edit Profile
- Two-user lock — only your two emails can register
- Protected routes — entire app behind auth gate
- Falls back to LocalStorage auth when Supabase isn't configured

### Sections
- **Hero** — fullscreen slideshow, live date/time, real-time relationship counter, typewriter taglines, background music
- **Gallery** — masonry layout, drag & drop upload, fullscreen lightbox with zoom/swipe/slideshow, albums, favorites, search
- **Video Gallery** — upload MP4/MOV/WEBM, auto-generated thumbnails, fullscreen player, favorites
- **Timeline** — animated milestone cards with emoji, date, photo, location
- **Journal** — daily entries with mood selector (8 moods), search, calendar view
- **Love Letters** — envelopes with wax-seal animation, rich text, favorites
- **Playlist** — upload MP3s, custom audio player, mark "Our Song", seek, volume, rotating album art
- **Quotes** — unlimited quotes, favorites, daily rotation
- **Bucket List** — interactive checklist with completion confetti, progress
- **Special Dates** — birthdays, anniversaries, trips with live countdowns
- **Places** — visual world map with pinned locations, stories, photos
- **Achievements** — 18 unlockable badges that auto-compute from your content
- **Mini Games** — Memory Match, Rock Paper Scissors, Spin the Wheel, Love Quiz, Would You Rather
- **Profile** — per-user avatar, bio, favorite song/quote, stats, change password
- **Settings** — accent color picker, animations toggle, music toggle, notifications toggle, floating hearts toggle, particles toggle

### System Features
- **Global Search** — ⌘K / Ctrl+K to search across all content (photos, videos, songs, letters, quotes, timeline, places, journal)
- **Notifications** — bell icon with unread count, auto-generated when content is added
- **Content Manager** — 13-tab modal to edit everything from the UI (no code)
- **Couple Streak** — daily check-ins with flame animations
- **Couple Calendar** — GitHub-style contribution grid with hearts
- **Easter Eggs** — Konami code (↑↑↓↓←→←→BA), click-heart-10-times for secret letter, confetti, fireworks

### Design
- Apple Liquid Glass UI — glassmorphism, aurora gradients, blur effects
- Framer Motion + GSAP animations throughout
- Floating hearts, particle starfield, parallax
- Dark / Light mode with smooth transitions
- Custom fonts: Playfair Display + Dancing Script + Geist
- Fully responsive — mobile-first
- Accessible — ARIA labels, keyboard nav, semantic HTML

## 🚀 Quick Start

### Local Mode (works immediately)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — register with any email, app is fully functional with browser-only persistence.

### Cloud Mode (real auth + sync)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in your Supabase SQL editor
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase keys + allowed emails
4. Restart `npm run dev` — the app auto-upgrades to Cloud Mode

See **[SETUP.md](./SETUP.md)** for the complete step-by-step guide.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Animations:** Framer Motion + GSAP
- **State:** Zustand (with LocalStorage persistence)
- **Backend:** Supabase (Auth + Database + Storage + Realtime)
- **Confetti:** canvas-confetti

## 📁 Architecture

```
src/
├── app/                    # Next.js routes (single-page)
├── components/
│   ├── auth/               # Auth screen
│   ├── content/            # Content Manager + Photo Manager
│   ├── sections/           # All page sections (Hero, Gallery, etc.)
│   ├── shared/             # Loading, particles, notifications, search
│   └── ui/                 # shadcn/ui component library
├── hooks/                  # Custom hooks (auth, streak, konami, etc.)
└── lib/
    ├── auth-context.tsx    # Auth provider (local + cloud)
    ├── content-store.ts    # Zustand store with all CRUD actions
    ├── supabase-client.ts  # Supabase client (graceful fallback)
    └── types.ts            # Shared TypeScript types
supabase/
└── schema.sql              # Database schema (run in Supabase SQL editor)
```

## 🎨 Editing Content

Two ways:
1. **In-app Content Manager** — click the gear icon in the nav. 13 tabs for photos, videos, songs, letters, quotes, timeline, notes, bucket list, special dates, places, future dreams, reasons, settings.
2. **JSON files** — edit `/public/data/*.json` directly, refresh, content updates.

## ☁️ Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add env vars (same 5 as `.env.local`)
5. Deploy — done in ~60 seconds

## 📝 License

Personal project — made with love.
