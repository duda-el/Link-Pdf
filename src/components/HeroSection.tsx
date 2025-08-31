"use client";

import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, Lock, Loader2 } from "lucide-react";

interface HeroSectionProps {
  onConvert?: (url: string) => void;
}

// fetch helper with Abort support
async function convertAndDownload(url: string, signal: AbortSignal) {
  const res = await fetch("/api/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal,
  });

  if (!res.ok) {
    const info = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(info?.error || "convert_failed");
  }

  const blob = await res.blob();
  const fileUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = "link2pdf.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(fileUrl);
}

export default function HeroSection({ onConvert = () => {} }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [eta, setEta] = useState(0); // seconds remaining (optimistic)
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  const startProgress = (estimateSec: number) => {
    const started = Date.now();
    setProgress(4);
    setEta(estimateSec);

    // smooth optimistic progress up to 95%
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      const pct = Math.min(95, Math.floor((elapsed / estimateSec) * 90) + 5);
      setProgress(pct);
      setEta(Math.max(0, Math.ceil(estimateSec - elapsed)));
    }, 200);
  };

  const stopProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleConvert = async () => {
    if (!url || isConverting) return;

    setIsConverting(true);
    const ESTIMATE_SEC = 12; // tune for your typical pages
    startProgress(ESTIMATE_SEC);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await convertAndDownload(url, ctrl.signal);
      // finish the bar and reset
      setProgress(100);
      setEta(0);
      onConvert(url);
      setTimeout(() => setIsConverting(false), 250);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error(e);
        alert("Conversion failed. Try another URL.");
      }
      setIsConverting(false);
    } finally {
      stopProgress();
      abortRef.current = null;
    }
  };

  const cancelConvert = () => {
    abortRef.current?.abort();
    stopProgress();
    setIsConverting(false);
    setProgress(0);
    setEta(0);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
      />

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 md:gap-16 lg:grid-cols-2">
          {/* LEFT: copy + input */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              New: cleaner typography in exported PDFs
            </div>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              Convert any webpage to a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                clean, readable PDF
              </span>
            </h1>

            <p className="mt-4 text-lg text-gray-600 md:text-xl">
              Turn cluttered pages into beautiful, distraction-free PDFs with one click.
            </p>

            <div className="mt-8 max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    type="url"
                    placeholder="Paste any URL here…"
                    className="h-14 px-4 pr-10 text-lg shadow-lg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (isConverting ? cancelConvert() : handleConvert())}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                </div>

                <Button
                  onClick={isConverting ? cancelConvert : handleConvert}
                  className={`h-14 px-7 text-lg transition-colors ${
                    isConverting ? "bg-slate-700 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={!url && !isConverting}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Converting… {eta > 0 ? `${eta}s` : ""}
                    </>
                  ) : (
                    <>
                      Convert to PDF
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              {/* thin progress bar under controls */}
              {isConverting && (
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500">
                <Badge>100% Free for basic use</Badge>
                <Badge>No registration required</Badge>
                <Badge>Privacy focused</Badge>
              </div>
            </div>
          </div>

          {/* RIGHT: floating browser mockup with video */}
          <div className="relative">
            {/* glow */}
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-indigo-500/20 blur-2xl"
            />
            {/* mock browser frame */}
            <div className="group relative mx-auto w-full max-w-xl rotate-[0.5deg] transition-transform duration-500 md:hover:rotate-0 md:hover:scale-[1.01]">
              {/* top bar */}
              <div className="mx-auto w-full rounded-t-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-3 h-5 flex-1 rounded-md bg-white/80 shadow-inner" />
                </div>
              </div>

              {/* video canvas */}
              <div className="-mt-px overflow-hidden rounded-b-2xl border border-slate-200 bg-white shadow-xl">
                <div className="relative w-full">
                  <div className="aspect-[16/10] w-full">
                    <video
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      poster="/hero-poster.jpg"
                    >
                      <source src="/video.mp4" type="video/mp4" />
                    </video>
                  </div>

                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/40 to-transparent"
                  />
                </div>
              </div>

              {/* floating caption chip */}
              <div className="absolute -bottom-4 left-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-md">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  See it in action
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-white/80 px-3 py-1 shadow-sm backdrop-blur border border-slate-200">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {children}
    </span>
  );
}
