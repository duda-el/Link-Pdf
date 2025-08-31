// src/app/signin/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import SignInCard from "@/components/SignInCard"; // <-- ensure correct path

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="relative overflow-hidden overflow-x-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* background blobs (kept but clipped by overflow-hidden) */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

      {/* center the card in viewport without extra vertical padding */}
      <div className="mx-auto grid min-h-[88svh] max-w-7xl place-items-center px-4">
        <SignInCard />
      </div>
    </main>
  );
}
