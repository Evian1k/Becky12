-- ============================================================================
-- Our Forever ❤️ — Supabase Schema
-- ============================================================================
-- Run this in your Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROFILES TABLE (extends Supabase auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  avatar text default '',
  bio text default '',
  favorite_song text default '',
  favorite_quote text default '',
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- CONTENT TABLES — one for each section
-- ----------------------------------------------------------------------------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  src text not null,
  caption text default '',
  category text default 'Selfies',
  album text default 'Default',
  favorite boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  src text not null,
  title text not null,
  description text default '',
  thumbnail text default '',
  favorite boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  artist text default '',
  album text default '',
  duration text default '',
  src text not null,
  cover text default '',
  favorite boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient text default '',
  date text default '',
  signature text default '',
  preview text default '',
  body jsonb default '[]'::jsonb,
  favorite boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  author text default '',
  favorite boolean default false,
  category text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date timestamptz,
  description text default '',
  image text default '',
  emoji text default '❤️',
  location text default '',
  favorite boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date timestamptz not null default now(),
  mood text default 'neutral',
  title text default '',
  body text default '',
  photos jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.bucket_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  emoji text default '❤️',
  category text default '',
  completed boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  location text default '',
  story text default '',
  photos jsonb default '[]'::jsonb,
  visited_date date,
  lat numeric,
  lng numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.special_dates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date date not null,
  emoji text default '⭐',
  description text default '',
  recurring boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reasons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  short text not null,
  long text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.future_dreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  emoji text default '✨',
  gradient text default 'from-rose-400/30 to-pink-500/30',
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  category text default 'love',
  date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text default '',
  read boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'Our Forever',
  subtitle text default 'Our story is still being written...',
  partner1 text default '',
  partner2 text default '',
  anniversary_date timestamptz,
  made_by text default 'Made with ❤️',
  final_message text default '',
  accent_color text default '#ff4d6d',
  theme_color text default '#ff4d6d',
  animations_enabled boolean default true,
  music_enabled boolean default true,
  notifications_enabled boolean default true,
  floating_hearts_enabled boolean default true,
  particles_enabled boolean default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- Both partners share all data. To allow this, add both user IDs to a shared
-- "couple" — for simplicity, all authenticated users see all data.
-- For stricter "just us two" enforcement, you can restrict by ALLOWED_EMAILS
-- in your app code (already implemented in src/lib/auth-context.tsx).

alter table public.profiles enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.songs enable row level security;
alter table public.letters enable row level security;
alter table public.quotes enable row level security;
alter table public.timeline_events enable row level security;
alter table public.journal_entries enable row level security;
alter table public.bucket_list_items enable row level security;
alter table public.places enable row level security;
alter table public.special_dates enable row level security;
alter table public.reasons enable row level security;
alter table public.future_dreams enable row level security;
alter table public.notes enable row level security;
alter table public.notifications enable row level security;
alter table public.settings enable row level security;

-- Any authenticated user can read all data (both partners share)
-- (For stricter privacy, replace `auth.role() = 'authenticated'` with
--  `auth.uid() = user_id` for per-user isolation.)

create policy "Profiles are viewable by authenticated users" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Profiles are updatable by their owner" on public.profiles for update using (auth.uid() = id);
create policy "Profiles are insertable by their owner" on public.profiles for insert with check (auth.uid() = id);

create policy "Photos viewable by authenticated" on public.photos for select using (auth.role() = 'authenticated');
create policy "Photos insertable by authenticated" on public.photos for insert with check (auth.role() = 'authenticated');
create policy "Photos updatable by owner" on public.photos for update using (auth.uid() = user_id);
create policy "Photos deletable by owner" on public.photos for delete using (auth.uid() = user_id);

create policy "Videos viewable by authenticated" on public.videos for select using (auth.role() = 'authenticated');
create policy "Videos insertable by authenticated" on public.videos for insert with check (auth.role() = 'authenticated');
create policy "Videos updatable by owner" on public.videos for update using (auth.uid() = user_id);
create policy "Videos deletable by owner" on public.videos for delete using (auth.uid() = user_id);

create policy "Songs viewable by authenticated" on public.songs for select using (auth.role() = 'authenticated');
create policy "Songs insertable by authenticated" on public.songs for insert with check (auth.role() = 'authenticated');
create policy "Songs updatable by owner" on public.songs for update using (auth.uid() = user_id);
create policy "Songs deletable by owner" on public.songs for delete using (auth.uid() = user_id);

create policy "Letters viewable by authenticated" on public.letters for select using (auth.role() = 'authenticated');
create policy "Letters insertable by authenticated" on public.letters for insert with check (auth.role() = 'authenticated');
create policy "Letters updatable by owner" on public.letters for update using (auth.uid() = user_id);
create policy "Letters deletable by owner" on public.letters for delete using (auth.uid() = user_id);

create policy "Quotes viewable by authenticated" on public.quotes for select using (auth.role() = 'authenticated');
create policy "Quotes insertable by authenticated" on public.quotes for insert with check (auth.role() = 'authenticated');
create policy "Quotes updatable by owner" on public.quotes for update using (auth.uid() = user_id);
create policy "Quotes deletable by owner" on public.quotes for delete using (auth.uid() = user_id);

create policy "Timeline viewable by authenticated" on public.timeline_events for select using (auth.role() = 'authenticated');
create policy "Timeline insertable by authenticated" on public.timeline_events for insert with check (auth.role() = 'authenticated');
create policy "Timeline updatable by owner" on public.timeline_events for update using (auth.uid() = user_id);
create policy "Timeline deletable by owner" on public.timeline_events for delete using (auth.uid() = user_id);

create policy "Journal viewable by authenticated" on public.journal_entries for select using (auth.role() = 'authenticated');
create policy "Journal insertable by authenticated" on public.journal_entries for insert with check (auth.role() = 'authenticated');
create policy "Journal updatable by owner" on public.journal_entries for update using (auth.uid() = user_id);
create policy "Journal deletable by owner" on public.journal_entries for delete using (auth.uid() = user_id);

create policy "Bucket list viewable by authenticated" on public.bucket_list_items for select using (auth.role() = 'authenticated');
create policy "Bucket list insertable by authenticated" on public.bucket_list_items for insert with check (auth.role() = 'authenticated');
create policy "Bucket list updatable by owner" on public.bucket_list_items for update using (auth.uid() = user_id);
create policy "Bucket list deletable by owner" on public.bucket_list_items for delete using (auth.uid() = user_id);

create policy "Places viewable by authenticated" on public.places for select using (auth.role() = 'authenticated');
create policy "Places insertable by authenticated" on public.places for insert with check (auth.role() = 'authenticated');
create policy "Places updatable by owner" on public.places for update using (auth.uid() = user_id);
create policy "Places deletable by owner" on public.places for delete using (auth.uid() = user_id);

create policy "Special dates viewable by authenticated" on public.special_dates for select using (auth.role() = 'authenticated');
create policy "Special dates insertable by authenticated" on public.special_dates for insert with check (auth.role() = 'authenticated');
create policy "Special dates updatable by owner" on public.special_dates for update using (auth.uid() = user_id);
create policy "Special dates deletable by owner" on public.special_dates for delete using (auth.uid() = user_id);

create policy "Reasons viewable by authenticated" on public.reasons for select using (auth.role() = 'authenticated');
create policy "Reasons insertable by authenticated" on public.reasons for insert with check (auth.role() = 'authenticated');
create policy "Reasons updatable by owner" on public.reasons for update using (auth.uid() = user_id);
create policy "Reasons deletable by owner" on public.reasons for delete using (auth.uid() = user_id);

create policy "Dreams viewable by authenticated" on public.future_dreams for select using (auth.role() = 'authenticated');
create policy "Dreams insertable by authenticated" on public.future_dreams for insert with check (auth.role() = 'authenticated');
create policy "Dreams updatable by owner" on public.future_dreams for update using (auth.uid() = user_id);
create policy "Dreams deletable by owner" on public.future_dreams for delete using (auth.uid() = user_id);

create policy "Notes viewable by authenticated" on public.notes for select using (auth.role() = 'authenticated');
create policy "Notes insertable by authenticated" on public.notes for insert with check (auth.role() = 'authenticated');
create policy "Notes updatable by owner" on public.notes for update using (auth.uid() = user_id);
create policy "Notes deletable by owner" on public.notes for delete using (auth.uid() = user_id);

create policy "Notifications viewable by authenticated" on public.notifications for select using (auth.role() = 'authenticated');
create policy "Notifications insertable by authenticated" on public.notifications for insert with check (auth.role() = 'authenticated');
create policy "Notifications updatable by owner" on public.notifications for update using (auth.uid() = user_id);
create policy "Notifications deletable by owner" on public.notifications for delete using (auth.uid() = user_id);

create policy "Settings viewable by authenticated" on public.settings for select using (auth.role() = 'authenticated');
create policy "Settings insertable by authenticated" on public.settings for insert with check (auth.role() = 'authenticated');
create policy "Settings updatable by owner" on public.settings for update using (auth.uid() = user_id);
create policy "Settings deletable by owner" on public.settings for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- STORAGE BUCKET for media uploads
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: any authenticated user can upload/read
create policy "Media bucket public read" on storage.objects for select using (bucket_id = 'media');
create policy "Media bucket authenticated upload" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Media bucket owner update" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Media bucket owner delete" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- REALTIME — enable for all tables
-- ----------------------------------------------------------------------------
alter table public.photos replica identity full;
alter table public.videos replica identity full;
alter table public.songs replica identity full;
alter table public.letters replica identity full;
alter table public.quotes replica identity full;
alter table public.timeline_events replica identity full;
alter table public.journal_entries replica identity full;
alter table public.bucket_list_items replica identity full;
alter table public.places replica identity full;
alter table public.special_dates replica identity full;
alter table public.reasons replica identity full;
alter table public.future_dreams replica identity full;
alter table public.notes replica identity full;
alter table public.notifications replica identity full;
alter table public.settings replica identity full;

-- Enable realtime
do $$
declare
  t text;
begin
  foreach t in array array[
    'photos','videos','songs','letters','quotes','timeline_events',
    'journal_entries','bucket_list_items','places','special_dates',
    'reasons','future_dreams','notes','notifications','settings'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- Done! Your database is ready.
