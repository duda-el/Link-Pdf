import { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import type { Browser } from "puppeteer-core";

// IMPORTANT: run on Node runtime (not Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function launchBrowser(): Promise<Browser> {
  const isProd =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  if (isProd) {
    const puppeteer = await import("puppeteer-core");
    const execPath = await chromium.executablePath();
    return puppeteer.launch({
      args: chromium.args,
      executablePath: execPath,
      headless: true,
    });
  } else {
    // local dev uses full puppeteer (bundled Chrome)
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({
      headless: true,
      // comment the next line if you want to see the browser:
      // headless: "new",
    }) as unknown as Browser;
  }
}

export async function POST(req: NextRequest) {
  let browser: Browser | null = null;

  try {
    const { url, pageCap = 30 } = await req.json().catch(() => ({}));
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing url" }), {
        status: 400,
      });
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    // reader-friendly user agent
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    // load page
    await page.goto(url, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 60_000,
    });

    await page.addStyleTag({
      content: `
    body::after {
      content: "Made with Link2PDF";
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 50px;
      font-weight: bold;
      color: rgba(30, 64, 175, 0.3); /* deep blue with transparency */
      pointer-events: none;
    }
  `,
    });

    // (optional) watermark for guests later via page.addStyleTag(...)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
      // pageRanges: `1-${pageCap}` // enable if you want to hard-cap pages
    });

    await page.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="link2pdf.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "convert_failed" }), {
      status: 500,
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
