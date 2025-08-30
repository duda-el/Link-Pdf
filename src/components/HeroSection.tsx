"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, Lock, Loader2 } from "lucide-react";

interface HeroSectionProps {
  onConvert?: (url: string) => void;
}

export default function HeroSection({
  onConvert = () => {},
}: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    if (!url) return;

    setIsConverting(true);
    // Simulate conversion process
    setTimeout(() => {
      onConvert(url);
      setIsConverting(false);
    }, 2000);
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:py-32 bg-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Convert any webpage to clean, readable PDF
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Transform cluttered web pages into beautiful, distraction-free PDFs
          with just one click.
        </p>

        <div className="max-w-3xl mx-auto mb-8 relative">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Input
                type="url"
                placeholder="Paste any URL here..."
                className="h-14 text-lg px-4 pr-10 shadow-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
            </div>
            <Button
              onClick={handleConvert}
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isConverting || !url}
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  Convert to PDF
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>100% Free for basic use</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>No registration required</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>Privacy focused</span>
          </div>
        </div>
      </div>
    </section>
  );
}
