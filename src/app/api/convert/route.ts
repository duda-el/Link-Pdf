// src/app/api/convert/route.ts
import { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import type { Browser, Page } from "puppeteer-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* --------------------------------- Launch -------------------------------- */
async function launchBrowser(): Promise<Browser> {
  const isProd =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  if (isProd) {
    const puppeteer = await import("puppeteer-core");
    const executablePath = await chromium.executablePath();
    if (!executablePath) throw new Error("Chromium executablePath is null");
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
    // Local dev: full Puppeteer (bundled Chrome)
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({ headless: true }) as unknown as Browser;
  }
}

/* -------------------------- Readiness / Loader waits ---------------------- */

// Common loader selectors seen in SPA frameworks
const LOADER_SELECTORS = [
  '[aria-busy="true"]',
  ".loader, .loading, .spinner, .progress, .page-loader, .preloader",
  '#__next [data-loading="true"]',
  "[data-loader], [data-progress]",
].join(",");

// Wait until main content exists (best-effort)
async function waitForMain(page: Page, timeout = 10_000) {
  await page
    .waitForSelector("main, article, #__next, #root", { timeout })
    .catch(() => {});
}

// Consider an element "hidden" if display:none, visibility hidden/0, or zero size
async function waitForLoadersGone(page: Page, timeout = 10_000) {
  await page
    .waitForFunction(
      (sel: string) => {
        const els = Array.from(document.querySelectorAll(sel));
        const isHidden = (el: Element) => {
          const cs = window.getComputedStyle(el as HTMLElement);
          if (
            cs.display === "none" ||
            cs.visibility === "hidden" ||
            cs.opacity === "0"
          )
            return true;
          const rect = (el as HTMLElement).getBoundingClientRect();
          return rect.width === 0 || rect.height === 0;
        };
        return els.every(isHidden);
      },
      { timeout },
      LOADER_SELECTORS
    )
    .catch(() => {});
}

// Cheap DOM-stability check: no total element size change for ~windowMs
async function waitForStability(page: Page, windowMs = 800, timeout = 10_000) {
  const start = Date.now();
  let last = 0;
  while (Date.now() - start < timeout) {
    const size = await page.evaluate(() => {
      let total = 0;
      document.querySelectorAll("body *").forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect?.();
        if (r) total += r.width + r.height;
      });
      return Math.round(total);
    });
    if (size === last) return; // stable enough
    last = size;
    await new Promise((r) => setTimeout(r, windowMs));
  }
}

/* --------------------------------- Routes -------------------------------- */

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(req: NextRequest) {
  let browser: Browser | null = null;

  try {
    const {
      url,
      watermark = false,
      readySelector,
      pageCap, // optional: "1-10" or number
    } = (await req.json()) as {
      url?: string;
      watermark?: boolean;
      readySelector?: string;
      pageCap?: string | number;
    };

    if (!url || typeof url !== "string") {
      return Response.json({ error: "MISSING_URL" }, { status: 400 });
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );
    await page.emulateMediaType("screen");

    // Navigate first
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

    // Optional explicit "ready" selector from client
    if (readySelector && typeof readySelector === "string") {
      await page
        .waitForSelector(readySelector, { timeout: 15_000 })
        .catch(() => {});
    }

    // Generic readiness (handles SPA loaders)
    await waitForMain(page, 12_000);
    await waitForLoadersGone(page, 12_000);
    await page
      .evaluate(() => (document as any).fonts?.ready?.then?.(() => {}))
      .catch(() => {});
    await waitForStability(page, 800, 8_000);

    // Optional watermark (blue, tasteful)
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

    // Build PDF options
    const pdfOpts: Parameters<Page["pdf"]>[0] = {
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
    };
    if (typeof pageCap === "string" && pageCap.trim()) {
      (pdfOpts as any).pageRanges = pageCap; // e.g., "1-10"
    }

    const pdf: Uint8Array = (await page.pdf(pdfOpts)) as unknown as Uint8Array;
    await page.close().catch(() => {});

    // make Node Buffer, which is assignable to BodyInit
    const nodeBuffer = Buffer.from(pdf);

    // hand it directly to Response
    return new Response(nodeBuffer, {
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
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
