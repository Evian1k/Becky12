# Our Forever ❤️

A premium, fully-frontend romantic couple website — built with Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, and GSAP. Zero backend, zero authentication, zero cloud. Everything runs from local files, JSON data, and browser LocalStorage.

## ✨ Features

- **Hero** — fullscreen slideshow, live date/time, real-time relationship counter, typewriter taglines, background music
- **Our Story** — chapter cards derived from your timeline
- **Love Gallery** — masonry layout with fullscreen lightbox, zoom, swipe, slideshow
- **Memory Wall** — Pinterest-style board with polaroids, sticky notes, doodles
- **Timeline** — animated milestone cards
- **Bucket List** — interactive checklist with completion confetti
- **Reasons I Love You** — flippable cards (short + long text)
- **Love Letters** — envelopes with wax-seal animation that open into letters
- **Playlist** — custom audio player with rotating album art, seek, volume, "Our Song"
- **Couple Streak** — LocalStorage-backed daily check-ins with flame animations
- **Couple Calendar** — GitHub-style contribution grid with hearts
- **Daily Love Quote** — random rotation
- **Future Dreams** — gradient dream cards
- **Mini Games** — Memory Match, Rock Paper Scissors, Spin the Wheel, Love Quiz, Would You Rather
- **Easter Eggs** — Konami code, click-heart-10-times secret letter, confetti, fireworks
- **Dark / Light mode** with smooth transitions
- **Apple Liquid Glass UI** — glassmorphism, aurora gradients, floating hearts, particle starfield
- **Fully responsive** — mobile-first

## 🎨 Content Manager

Click the **gear icon** in the navigation (or "Edit Content" on the hero) to open the Content Manager. 13 tabs let you edit everything from the UI — no code changes needed:

- **Photos** — Apple-Photos-style uploader: drag & drop, multi-select, reorder, captions, fullscreen preview with zoom
- **Videos** — upload MP4/WebM, auto-generated thumbnails
- **Songs** — upload MP3s, mark one as "Our Song"
- **Letters**, **Quotes**, **Timeline**, **Notes**, **Bucket List**, **Special Dates**, **Places**, **Future Dreams**, **Reasons** — full CRUD
- **Settings** — title, partner names, anniversary date, accent color, footer message

Edits are saved to LocalStorage automatically and survive refreshes.

## 📁 Editing Content Without the UI

All editable content lives in `/public/data/*.json`. Edit any file → refresh the page → content updates. No rebuild required.

```
public/data/
├── settings.json        # title, names, anniversary, accent color, hero photos
├── gallery.json         # photos + albums + categories
├── timeline.json        # milestone events
├── letters.json         # love letters
├── playlist.json        # songs + ourSongId
├── quotes.json          # quotes with favorite flag
├── bucket-list.json     # goals
├── future-dreams.json   # dream cards
├── memories.json        # memory wall items
├── reasons.json         # flip-card reasons
├── special-dates.json   # birthdays, anniversaries
├── places.json          # visited places
├── notes.json           # love notes / journal
└── videos.json          # video gallery
```

## 🖼️ Media Folders

```
public/
├── gallery/    # couple photos (used in hero, gallery, memory wall)
├── images/     # misc images
├── videos/     # video files
└── music/      # MP3 files
```

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Click Deploy — no env vars needed

## 🔌 Adding a Backend Later (Optional)

The code is modular. To plug in Firebase / Supabase / Cloudinary:

1. In `src/lib/content-store.ts`, replace the `persist` storage engine with API calls.
2. In `src/components/content/photo-manager.tsx`, replace `URL.createObjectURL(file)` with an upload API call.

The React UI does not need to change.

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Framer Motion
- Zustand (state management with LocalStorage persistence)
- canvas-confetti
- Lucide icons

## 📝 License

Personal project — made with love.
