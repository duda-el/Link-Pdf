"use client";

import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import { ArrowUp } from "lucide-react";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <PricingSection />

      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-md hover:shadow-lg"
      >
        <ArrowUp className="h-4 w-4" />
        Top
      </button>
    </main>
  );
}
