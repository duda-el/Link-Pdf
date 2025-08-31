"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Profile = { full_name: string | null; avatar_url: string | null } | null;

export function useAuthProfile() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    const sb = supabaseBrowser();

    const load = async () => {
      try {
        // hydrate session (important with @supabase/ssr)
        await sb.auth.getSession();

        const { data: { user } } = await sb.auth.getUser();
        setUserId(user?.id ?? null);

        if (user?.id) {
          const { data, error } = await sb
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();

          if (!error) setProfile(data);
          else {
            console.warn("profiles fetch error:", error.message);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("useAuthProfile error:", err);
        setProfile(null);
        setUserId(null);
      } finally {
        setLoading(false); // <- always clear loading
      }
    };

    load();

    // live updates when auth changes
    const { data: sub } = sb.auth.onAuthStateChange(async () => {
      setLoading(true);
      await load();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { loading, userId, profile };
}
