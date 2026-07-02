"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Camera, Save, LogOut, Lock, Heart, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useContentStore } from "@/lib/content-store";
import { SectionHeading, SectionWrapper } from "@/components/shared/section-heading";
import { fireConfetti } from "@/lib/confetti-helpers";

export function Profile() {
  const { user, updateProfile, signOut, updatePassword } = useAuth();
  const settings = useContentStore((s) => s.settings);
  const gallery = useContentStore((s) => s.gallery);
  const letters = useContentStore((s) => s.letters);
  const timeline = useContentStore((s) => s.timeline);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [favoriteSong, setFavoriteSong] = useState(user?.favoriteSong || "");
  const [favoriteQuote, setFavoriteQuote] = useState(user?.favoriteQuote || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  if (!user) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const save = async () => {
    await updateProfile({ name, bio, favoriteSong, favoriteQuote, avatar });
    setEditing(false);
    fireConfetti();
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      setPwMessage("Password must be at least 6 characters.");
      return;
    }
    const { error } = await updatePassword(newPassword);
    setPwMessage(error || "Password updated.");
    setNewPassword("");
  };

  const stats = [
    { label: "Photos", value: gallery.photos.length, emoji: "📸" },
    { label: "Letters", value: letters.length, emoji: "💌" },
    { label: "Memories", value: timeline.length, emoji: "✨" },
  ];

  return (
    <SectionWrapper id="profile">
      <SectionHeading
        eyebrow="This Is Me"
        title={<>My <span className="text-gradient-romantic">Profile</span></>}
        subtitle="A little corner that's just mine."
      />

      <div className="mx-auto mt-12 max-w-2xl">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-6 sm:p-8"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
            <div className="relative">
              <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow">
                {avatar ? (
                   
                  <img src={avatar} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon size={40} />
                )}
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-rose-500 shadow-lg">
                  <Camera size={14} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              )}
            </div>

            <div className="mt-4 flex-1 text-center sm:mt-0 sm:text-left">
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-lg font-bold outline-none focus:border-rose-500"
                />
              ) : (
                <h3 className="font-serif-display text-2xl font-bold">{user.name}</h3>
              )}
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
                <Mail size={12} /> {user.email}
              </p>
              {settings.anniversaryDate && (
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-rose-500 sm:justify-start">
                  <Heart size={10} fill="currentColor" strokeWidth={0} /> Together since {new Date(settings.anniversaryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Bio</p>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few words about you..."
                rows={3}
                className="w-full rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
              />
            ) : (
              <p className="text-sm text-foreground/80">{user.bio || "No bio yet — click edit to add one."}</p>
            )}
          </div>

          {/* Favorites */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Favorite Song</p>
              {editing ? (
                <input
                  type="text"
                  value={favoriteSong}
                  onChange={(e) => setFavoriteSong(e.target.value)}
                  placeholder="Song title"
                  className="w-full rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              ) : (
                <p className="text-sm">{user.favoriteSong || "—"}</p>
              )}
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Favorite Quote</p>
              {editing ? (
                <input
                  type="text"
                  value={favoriteQuote}
                  onChange={(e) => setFavoriteQuote(e.target.value)}
                  placeholder="Quote"
                  className="w-full rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              ) : (
                <p className="text-sm">{user.favoriteQuote || "—"}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-rose-500/5 p-3 text-center">
                <div className="text-2xl">{s.emoji}</div>
                <div className="mt-1 font-serif-display text-2xl font-bold text-rose-500">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-rose-500/10">
                  Cancel
                </button>
                <button onClick={save} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-glow">
                  <Save size={12} /> Save
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="rounded-full bg-rose-500/10 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/20">
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass mt-6 rounded-3xl p-6"
        >
          <h4 className="flex items-center gap-2 font-serif-display text-lg font-bold">
            <Lock size={16} /> Change Password
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="flex-1 rounded-xl border border-rose-500/20 bg-background/50 px-3 py-2 text-sm outline-none focus:border-rose-500"
              minLength={6}
            />
            <button onClick={changePassword} className="rounded-full bg-rose-500/10 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/20">
              Update
            </button>
          </div>
          {pwMessage && <p className="mt-2 text-xs text-muted-foreground">{pwMessage}</p>}
        </motion.div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-6 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/20"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
