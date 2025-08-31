// src/app/signin/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import SignInCard from "@/components/SignInCard";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/");
  return (
    <main className="relative min-h-[80vh] bg-gradient-to-b from-blue-50 via-white to-white">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20 md:py-28">
        <SignInCard />
      </div>
    </main>
  );
}
