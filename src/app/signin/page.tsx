// src/app/signin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInCard from "@/components/SignInCard";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignInPage() {
  const router = useRouter();

  // If already logged in, redirect to home (client-side)
  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace("/");
    })();
  }, [router]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden overflow-x-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* background blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl place-items-center px-4">
        <SignInCard />
      </div>
    </main>
  );
}
