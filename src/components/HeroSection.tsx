"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, Lock, Loader2 } from "lucide-react";

interface HeroSectionProps {
  onConvert?: (url: string) => void;
}

export default function HeroSection({ onConvert = () => {} }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    if (!url) return;
    setIsConverting(true);
    setTimeout(() => {
      onConvert(url);
      setIsConverting(false);
    }, 2000);
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
                    onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                </div>
                <Button
                  onClick={handleConvert}
                  className="h-14 px-7 text-lg bg-blue-600 hover:bg-blue-700"
                  disabled={isConverting || !url}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Converting…
                    </>
                  ) : (
                    <>
                      Convert to PDF
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

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
                  {/* keep nice aspect; taller than 16:9 for a “product” feel */}
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

                  {/* soft top gradient to make overlaid UI readable if needed */}
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
