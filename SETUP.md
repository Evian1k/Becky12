# Setup Guide — Our Forever ❤️

This guide walks you through connecting your Supabase backend so the app upgrades from **Local Mode** (browser-only) to **Cloud Mode** (real auth, real-time sync, cloud storage).

## 🚀 Quick Start (Local Mode — works now)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the app is fully functional in Local Mode:
- Register with any email (no allowlist configured)
- All content saved to browser LocalStorage
- Survives refresh but doesn't sync across devices

## ☁️ Upgrade to Cloud Mode (Supabase)

### Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **New Project**
3. Name it `our-forever` (or anything you like)
4. Set a strong database password — save it somewhere safe
5. Choose a region close to you
6. Click **Create new project** — wait ~2 minutes for provisioning

### Step 2: Get your API keys

In your Supabase dashboard:
1. Go to **Settings → API**
2. Copy these three values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (a long JWT starting with `eyJ...`)
   - **service_role** key (also a JWT — keep this secret!)

### Step 3: Create the database schema

1. In Supabase dashboard, go to **SQL Editor → New Query**
2. Open the file `supabase/schema.sql` from this repo
3. Copy the entire contents and paste into the SQL editor
4. Click **Run** — you should see "Success. No rows returned"
5. All 16 tables, RLS policies, and storage bucket are now created

### Step 4: Configure authentication

1. In Supabase dashboard, go to **Authentication → Providers**
2. Make sure **Email** is enabled (it is by default)
3. (Optional) Go to **Authentication → Email Templates** to customize the password reset email
4. (Optional) Go to **Authentication → URL Configuration** to set your production URL after deploying

### Step 5: Add your env vars

Create a file called `.env.local` in the project root (next to `package.json`):

```bash
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# The two emails allowed to register (comma-separated, lowercase)
ALLOWED_EMAIL_1=you@example.com
ALLOWED_EMAIL_2=her@example.com
```

**Important:** Never commit `.env.local` to git. The `.gitignore` already excludes it.

### Step 6: Restart and verify

```bash
npm run dev
```

Open http://localhost:3000 — you should now see **"Cloud mode • Real sync enabled"** on the auth screen. Register with one of your two allowed emails — you'll get a confirmation email from Supabase. After confirming, sign in, and you're in cloud mode.

## 🔄 How Cloud Mode works

- **Auth:** Real Supabase Auth with JWT sessions, bcrypt-hashed passwords, secure cookies
- **Database:** All content saved to Supabase Postgres with row-level security
- **Storage:** Photos, videos, songs uploaded to Supabase Storage bucket `media`
- **Realtime:** When one of you adds a photo, the other sees it instantly — no refresh needed
- **Sync:** Both accounts share the same data — only your two emails can register

## 🎨 Customization

All editable content lives in `/public/data/*.json`. Edit any file → refresh → content updates. Or use the in-app Content Manager (gear icon in nav).

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. In **Environment Variables**, add the same 5 vars from `.env.local`
5. Click **Deploy**

## 🔒 Security Notes

- **Row-level security** is enabled on every table — only authenticated users can read, only owners can edit/delete
- **Email allowlist** restricts registration to just your two emails (when env vars are set)
- **Service role key** is server-only — never exposed to the browser
- **JWT sessions** auto-refresh and expire securely
- **Password reset** emails come from Supabase's managed sender (or configure your own SMTP)

## 🆘 Troubleshooting

**"Cloud mode • Real sync enabled" doesn't show**
→ Check that all 5 env vars are in `.env.local` and restart the dev server

**"This email is not on the invited list"**
→ Your email isn't in `ALLOWED_EMAIL_1` or `ALLOWED_EMAIL_2`. Add it and restart

**Registration succeeds but I can't sign in**
→ Supabase requires email confirmation by default. Check your inbox, or disable email confirmation in Authentication → Settings for development

**Photos don't upload**
→ Make sure you ran the schema.sql that creates the `media` storage bucket. Check Storage → media in your Supabase dashboard

**Realtime not working**
→ Run the last block of schema.sql (the `alter publication supabase_realtime` part) — it enables realtime on all tables

## 📁 Project Structure

```
.
├── public/
│   ├── data/           # JSON content files (editable)
│   ├── gallery/        # Couple photos
│   ├── images/, videos/, music/
├── src/
│   ├── app/            # Next.js app router
│   ├── components/
│   │   ├── auth/       # Auth screen
│   │   ├── content/    # Content Manager + Photo Manager
│   │   ├── sections/   # All page sections
│   │   ├── shared/     # Reusable UI (loading, particles, etc.)
│   │   └── ui/         # shadcn/ui components
│   ├── hooks/          # Custom React hooks
│   └── lib/
│       ├── auth-context.tsx      # Auth provider (local + cloud modes)
│       ├── content-store.ts      # Zustand content store
│       ├── supabase-client.ts    # Supabase client (graceful fallback)
│       └── types.ts              # TypeScript types
├── supabase/schema.sql  # Database schema — run in Supabase SQL editor
└── SETUP.md             # This file
```

Made with ❤️ for the two of you.
