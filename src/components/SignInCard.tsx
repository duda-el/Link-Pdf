// src/components/ui/SignInCard.tsx
"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Loader2, ShieldCheck, Check, Lock } from "lucide-react";

export default function SignInCard() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // must match Supabase → Authentication → Redirect URLs
          redirectTo: `${window.location.origin}/api/auth/callback?next=/`,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        console.error("Google sign-in error:", error.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-lg">
        {/* Accent blur shapes */}
        <div aria-hidden className="absolute -top-24 -left-20 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -right-20 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl" />

        {/* Header */}
        <div className="mb-6 text-center relative z-10">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-600">
            Sign in to save conversions, remove watermarks, and unlock higher limits.
          </p>
        </div>

        {/* Features */}
        <ul className="mb-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />5 free conversions/day
          </li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />No watermarks</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />Up to 20 pages/export</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />Sync history</li>
        </ul>

        {/* Sign in button */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="group relative inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white font-medium shadow-lg hover:brightness-110 disabled:opacity-70 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Redirecting…
            </>
          ) : (
            <>
              {/* Google G inside white circle */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                <svg viewBox="0 0 48 48" aria-hidden role="img" className="h-5 w-5">
                  <title>Google</title>
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                  s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.441,6.053,28.971,4,24,4C12.955,4,4,12.955,4,24
                  s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.357,16.104,18.822,13,24,13c3.059,0,5.842,1.154,7.961,3.039
                  l5.657-5.657C33.441,6.053,28.971,4,24,4C16.318,4,9.637,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.176,0,9.862-1.979,13.409-5.197l-6.191-5.238C29.138,35.982,26.715,37,24,37
                  c-5.199,0-9.616-3.317-11.271-7.946l-6.508,5.015C9.529,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-.79,2.231-2.28,4.119-4.095,5.394l6.191,5.238
                  C34.965,40.824,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
              Continue with Google
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4" />
          We only store your email & profile picture. Delete anytime.
        </div>
      </div>
    </div>
  );
}
