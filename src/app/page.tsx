"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop((window.scrollY || 0) > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <PricingSection />

      {/* Back to top FAB */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={[
          "fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0))] z-50",
          "flex h-12 w-12 items-center justify-center rounded-full",
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
          "shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "transition-all duration-200",
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none",
        ].join(" ")}
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Back to top</span>
      </button>
    </main>
  );
}
