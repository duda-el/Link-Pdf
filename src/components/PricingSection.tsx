import React from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  subnote?: string; // e.g. "/ 100 credits"
}

const PricingSection = ({
  title = "Simple, transparent pricing",
  subtitle = "Choose the plan that works best for your needs",
  tiers = [
    {
      name: "Free",
      description: "Perfect for trying out the service",
      price: "$0",
      features: [
        { name: "5 PDF conversions per day", included: true },
        { name: "Reader mode", included: true },
        { name: "Small watermark on PDFs", included: true },
        { name: "Basic customization", included: false },
        { name: "Batch export", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Get Started",
      subnote: "/ forever",
    },
    {
      name: "Credit Bundle",
      description: "For professionals and power users",
      price: "$9.99",
      features: [
        { name: "100 PDF conversions", included: true },
        { name: "Reader mode", included: true },
        { name: "No watermarks", included: true },
        { name: "Advanced customization", included: true },
        { name: "Batch export", included: true },
        { name: "Priority support", included: true },
      ],
      buttonText: "Buy Credits",
      popular: true,
      subnote: "/ 100 credits",
    },
  ] as PricingTier[],
}) => {
  return (
    <section id="pricing" className="relative w-full scroll-mt-24">
      {/* subtle gradient background + pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.08),transparent_45%)]"
      />
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            No credit card required
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, idx) => (
            <div key={idx} className="group relative">
              {/* glow ring on hover / popular */}
              <div
                aria-hidden
                className={`absolute -inset-2 -z-10 rounded-2xl blur-2xl transition-opacity duration-300 ${
                  tier.popular
                    ? "opacity-100 bg-gradient-to-br from-blue-500/25 via-cyan-500/15 to-indigo-500/25"
                    : "opacity-0 group-hover:opacity-100 bg-gradient-to-br from-slate-300/20 to-slate-200/0"
                }`}
              />
              <Card
                className={`flex h-full flex-col rounded-2xl border bg-white/80 backdrop-blur-sm transition-all duration-300
                  ${tier.popular ? "border-blue-500/30 shadow-xl scale-[1.01]" : "border-slate-200/70 shadow-md hover:shadow-lg"}
                `}
              >
                <CardHeader className="relative">
                  {tier.popular && (
                    <div className="absolute -top-3 right-6">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-500">
                    {tier.description}
                  </CardDescription>

                  {/* price block */}
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                      {tier.price}
                    </span>
                    {tier.subnote && (
                      <span className="text-sm text-gray-500">{tier.subnote}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow pt-0">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        {feature.included ? (
                          <div className="mt-0.5 mr-2 rounded-full bg-emerald-50 p-1">
                            <Check className="h-4 w-4 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="mt-1 mr-2 h-5 w-5 rounded-full border border-gray-300" />
                        )}
                        <span
                          className={`${
                            feature.included ? "text-gray-700" : "text-gray-400 line-through"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* tiny reassurance strip */}
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Instant access · Cancel anytime
                  </div>
                </CardContent>

                <CardFooter className="mt-4">
                  <Button
                    className={`w-full h-12 text-base font-semibold transition-transform duration-200 ${
                      tier.popular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Need more conversions? Contact us for custom enterprise plans.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
