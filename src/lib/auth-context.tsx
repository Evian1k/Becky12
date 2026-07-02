"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase, isSupabaseConfigured, allowedEmails } from "@/lib/supabase-client";

type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  favoriteSong?: string;
  favoriteQuote?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isCloudMode: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (patch: Partial<User>) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = "our-forever-local-user";
const LOCAL_PASSWORD_KEY = "our-forever-local-password";

/** In local mode, the two allowed emails come from env vars; if not set, allow any email (demo mode). */
function getAllowedEmails(): string[] {
  return allowedEmails;
}

function isEmailAllowed(email: string): boolean {
  const allowed = getAllowedEmails();
  if (allowed.length === 0) return true; // No allowlist configured — accept any (demo mode)
  return allowed.includes(email.toLowerCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async (id: string, email: string) => {
    if (!supabase) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (data) {
      setUser({
        id: data.id,
        email,
        name: data.name || email.split("@")[0],
        avatar: data.avatar || "",
        bio: data.bio || "",
        favoriteSong: data.favorite_song || "",
        favoriteQuote: data.favorite_quote || "",
      });
    } else {
      // Profile doesn't exist yet — create a minimal one
      setUser({ id, email, name: email.split("@")[0], avatar: "", bio: "" });
    }
  }, []);

  // On mount: restore session
  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (isSupabaseConfigured && supabase) {
        // Cloud mode: restore Supabase session
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session?.user) {
          await loadUserProfile(data.session.user.id, data.session.user.email || "");
        }
        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            await loadUserProfile(session.user.id, session.user.email || "");
          } else {
            setUser(null);
          }
        });
      } else {
        // Local mode: restore from localStorage
        const raw = localStorage.getItem(LOCAL_USER_KEY);
        if (raw) {
          try {
            setUser(JSON.parse(raw));
          } catch { /* ignore */ }
        }
      }
      setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, [loadUserProfile]);

  async function signUp(email: string, password: string, name: string): Promise<{ error: string | null }> {
    if (!isEmailAllowed(email)) {
      return { error: "This email is not on the invited list. Only the two of us can join." };
    }
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          name,
          avatar: "",
          bio: "",
        });
      }
      return { error: null };
    }
    // Local mode
    const existing = localStorage.getItem(LOCAL_USER_KEY);
    if (existing) {
      const u = JSON.parse(existing);
      if (u.email === email) return { error: "An account with this email already exists locally." };
    }
    const newUser: User = {
      id: `local-${Date.now()}`,
      email,
      name,
      avatar: "",
      bio: "",
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(LOCAL_PASSWORD_KEY, JSON.stringify({ email, password }));
    setUser(newUser);
    return { error: null };
  }

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    }
    // Local mode
    const raw = localStorage.getItem(LOCAL_PASSWORD_KEY);
    if (!raw) return { error: "No account yet. Register first." };
    const stored = JSON.parse(raw);
    if (stored.email !== email || stored.password !== password) {
      return { error: "Wrong email or password." };
    }
    const userRaw = localStorage.getItem(LOCAL_USER_KEY);
    if (userRaw) setUser(JSON.parse(userRaw));
    return { error: null };
  }

  async function signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.removeItem(LOCAL_PASSWORD_KEY);
  }

  async function resetPassword(email: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) return { error: error.message };
      return { error: null };
    }
    return { error: "Password reset requires cloud mode (Supabase connected). In local mode, just register again." };
  }

  async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return { error: null };
    }
    return { error: "Not available in local mode." };
  }

  async function updateProfile(patch: Partial<User>): Promise<{ error: string | null }> {
    if (!user) return { error: "Not signed in." };
    const updated = { ...user, ...patch };
    setUser(updated);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("profiles").update({
        name: updated.name,
        avatar: updated.avatar,
        bio: updated.bio,
        favorite_song: updated.favoriteSong,
        favorite_quote: updated.favoriteQuote,
      }).eq("id", user.id);
      if (error) return { error: error.message };
    } else {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    }
    return { error: null };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isCloudMode: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
