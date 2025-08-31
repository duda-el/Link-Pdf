// src/app/api/convert/route.ts
import { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import type { Browser } from "puppeteer-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function launchBrowser(): Promise<Browser> {
  const isProd =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  if (isProd) {
    const puppeteer = await import("puppeteer-core");
    const executablePath = await chromium.executablePath(); // string | null

    if (!executablePath) {
      throw new Error("Chromium executablePath is null");
    }

    return puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
      ],
      executablePath,
      headless: true,
    });
  } else {
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({ headless: true }) as unknown as Browser;
  }
}

// Optional: quick health check
export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(req: NextRequest) {
  let browser: Browser | null = null;

  try {
    const { url, watermark = false } = await req.json();
    if (!url) return Response.json({ error: "MISSING_URL" }, { status: 400 });

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );
    await page.emulateMediaType("screen");

    // navigate
    try {
      await page.goto(url, {
        waitUntil: ["domcontentloaded", "networkidle0"],
        timeout: 60_000,
      });
    } catch (e: any) {
      return Response.json(
        { error: "NAVIGATION_FAILED", detail: String(e) },
        { status: 502 }
      );
    }

    // optional watermark
    if (watermark) {
      await page.addStyleTag({
        content: `
          body::after {
            content: "Made with Link2PDF";
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 50px; font-weight: 700;
            color: rgba(37, 99, 235, 0.15);
            pointer-events: none; z-index: 9999; white-space: nowrap;
          }
        `,
      });
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
    });

    await page.close();

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="link2pdf.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("[convert] FATAL:", err);
    return Response.json(
      { error: "CONVERT_FAILED", detail: String(err) },
      { status: 500 }
    );
  } finally {
    if (browser)
      try {
        await browser.close();
      } catch {}
  }
}
