// src/app/api/debug-site/route.ts
import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  return NextResponse.json({
    siteUrl: getSiteUrl(),
    vercelUrl: process.env.VERCEL_URL || null,
    nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  });
}
