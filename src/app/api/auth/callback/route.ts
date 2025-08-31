// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  // If Supabase forwarded an error from Google, show it
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description");
  if (err || desc) {
    return NextResponse.json(
      { stage: "supabase->app redirect", err, desc },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { stage: "missing_code", message: "No ?code in URL" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { error: exchError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchError) {
    return NextResponse.json(
      { stage: "exchangeCodeForSession", error: exchError.message },
      { status: 500 }
    );
  }

  // Check if cookie/session is now visible to the server
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        stage: "post-exchange getUser()",
        message: "No user after exchange (cookies not set?)"
      },
      { status: 500 }
    );
  }

  // Success – redirect to app
  return NextResponse.redirect(`${url.origin}${next}`);
}
