import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client — initialized from env vars. If env vars are missing,
 * `supabase` is null and the app falls back to LocalStorage mode.
 *
 * To enable cloud auth + sync + storage:
 * 1. Create a project at https://supabase.com
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 *    SUPABASE_SERVICE_ROLE_KEY=eyJ...   (server-only, never exposed)
 *    ALLOWED_EMAIL_1=you@example.com
 *    ALLOWED_EMAIL_2=her@example.com
 * 3. Run the SQL in /supabase/schema.sql in your Supabase SQL editor
 * 4. Restart the dev server — the app auto-detects the keys and upgrades.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const allowedEmails = [
  process.env.ALLOWED_EMAIL_1,
  process.env.ALLOWED_EMAIL_2,
].filter(Boolean) as string[];

/** Client-side Supabase (uses anon key, respects RLS). */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Server-side Supabase (uses service role key, bypasses RLS).
 * Only call from /app/api/* routes — never expose this to the client.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
