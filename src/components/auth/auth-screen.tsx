"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User as UserIcon, ArrowRight, Cloud, HardDrive, Eye, EyeOff, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fireHearts } from "@/lib/confetti-helpers";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "forgot" | "confirm";

export function AuthScreen() {
  const { signIn, signUp, resetPassword, resendConfirmation, isCloudMode } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error, needsConfirmation } = await signIn(email, password);
        if (needsConfirmation) {
          setConfirmEmail(email);
          setMode("confirm");
        } else if (error) {
          setError(error);
        } else {
          fireHearts();
        }
      } else if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.");
          setSubmitting(false);
          return;
        }
        const { error, needsConfirmation } = await signUp(email, password, name);
        if (needsConfirmation) {
          setConfirmEmail(email);
          setMode("confirm");
        } else if (error) {
          setError(error);
        } else {
          fireHearts();
        }
      } else if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) setError(error);
        else setSuccess("Check your inbox for a reset link.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setSubmitting(true);
    setError(null);
    const { error } = await resendConfirmation(confirmEmail);
    if (error) {
      setError(error);
    } else {
      setSuccess("Confirmation email sent! Check your inbox (and spam folder).");
    }
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-rose-950 via-pink-950 to-purple-950">
      <div className="pointer-events-none absolute inset-0 bg-aurora-dark opacity-60" />
      <div className="pointer-events-none absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400/30"
            style={{ left: `${5 + i * 10}%`, top: `${10 + (i % 5) * 18}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart size={16} fill="currentColor" strokeWidth={0} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 grid min-h-screen place-items-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong w-full max-w-md rounded-3xl p-8 sm:p-10"
        >
          <div className="mb-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-glow"
            >
              <Heart size={28} fill="currentColor" strokeWidth={0} className="text-white" />
            </motion.div>
            <h1 className="font-script text-5xl text-white">Our Forever</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-rose-200/70">A Love Story</p>
          </div>

          {/* Confirm email screen */}
          {mode === "confirm" ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-rose-500/20 text-rose-400"
              >
                <MailCheck size={28} />
              </motion.div>
              <h3 className="font-serif-display text-xl font-bold text-white">Check your email</h3>
              <p className="mt-2 text-sm text-rose-200/70">
                We sent a confirmation link to
              </p>
              <p className="mt-1 font-medium text-white">{confirmEmail}</p>
              <p className="mt-3 text-xs text-rose-200/50">
                Click the link in the email to confirm your account, then come back and sign in.
                Don't forget to check your spam folder!
              </p>

              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl bg-green-500/15 px-4 py-2.5 text-xs text-green-300">
                  {success}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl bg-red-500/15 px-4 py-2.5 text-xs text-red-300">
                  {error}
                </motion.div>
              )}

              <div className="mt-6 space-y-2">
                <button
                  onClick={handleResend}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  <RefreshCw size={14} className={submitting ? "animate-spin" : ""} />
                  {submitting ? "Sending..." : "Resend confirmation email"}
                </button>
                <button
                  onClick={() => { setMode("signin"); setError(null); setSuccess(null); }}
                  className="w-full rounded-xl bg-white/5 py-3 text-sm text-rose-200/70 hover:bg-white/10"
                >
                  ← Back to sign in
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-rose-500/10 p-3 text-left text-xs text-rose-200/60">
                <p className="font-medium text-rose-300">💡 To skip email confirmation:</p>
                <p className="mt-1">
                  Go to your Supabase dashboard → Authentication → Providers → Email →
                  turn OFF "Confirm email" → Save. Then sign in directly.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Mode tabs */}
              {mode !== "forgot" && (
                <div className="mb-6 flex rounded-full bg-white/5 p-1">
                  <button
                    onClick={() => { setMode("signin"); setError(null); }}
                    className={cn(
                      "flex-1 rounded-full py-2 text-sm font-medium transition-all",
                      mode === "signin" ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow" : "text-rose-200/60"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMode("signup"); setError(null); }}
                    className={cn(
                      "flex-1 rounded-full py-2 text-sm font-medium transition-all",
                      mode === "signup" ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow" : "text-rose-200/60"
                    )}
                  >
                    Register
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-wider text-rose-200/70">Name</label>
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300/60" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder:text-rose-200/40 outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-rose-200/70">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder:text-rose-200/40 outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-wider text-rose-200/70">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300/60" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 pr-10 text-sm text-white placeholder:text-rose-200/40 outline-none focus:border-rose-500"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300/60 hover:text-rose-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-500/15 px-4 py-2.5 text-xs text-red-300">
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-green-500/15 px-4 py-2.5 text-xs text-green-300">
                    {success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting ? "Please wait..." : (
                    <>
                      {mode === "signin" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "forgot" && "Send Reset Link"}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-rose-200/60">
                {mode === "signin" && (
                  <button onClick={() => { setMode("forgot"); setError(null); }} className="hover:text-rose-200">
                    Forgot password?
                  </button>
                )}
                {mode === "forgot" && (
                  <button onClick={() => { setMode("signin"); setError(null); setSuccess(null); }} className="hover:text-rose-200">
                    ← Back to sign in
                  </button>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-rose-200/50">
            {isCloudMode ? (
              <>
                <Cloud size={10} /> Cloud mode • Real sync enabled
              </>
            ) : (
              <>
                <HardDrive size={10} /> Local mode • Add Supabase keys for cloud sync
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
