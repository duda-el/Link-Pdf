import React from "react";
import { Link, FileDown, Wand2 } from "lucide-react";

/**
 * Modern, accessible stepper:
 * - Mobile: vertical timeline with connectors
 * - Desktop: 3-up cards with a subtle gradient connector
 * - Depth on hover, color accents per step, strong focus-visible states
 */

type Step = {
  number: number;
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: "blue" | "violet" | "cyan";
};

const STEPS: Step[] = [
  {
    number: 1,
    title: "Paste URL",
    description: "Drop any webpage link to start the conversion.",
    Icon: Link,
    accent: "blue",
  },
  {
    number: 2,
    title: "Convert",
    description:
      "We render a distraction-free, reader-mode version of the page.",
    Icon: Wand2,
    accent: "violet",
  },
  {
    number: 3,
    title: "Download",
    description: "Export a clean, printable PDF—ready for offline reading.",
    Icon: FileDown,
    accent: "cyan",
  },
];

const accentMap = {
  blue: {
    ring: "ring-blue-500/25",
    halo: "from-blue-500/18 via-sky-500/10 to-transparent",
    icon: "text-blue-600",
    dot: "bg-blue-600",
    badgeBg: "bg-blue-50",
  },
  violet: {
    ring: "ring-violet-500/25",
    halo: "from-violet-500/18 via-fuchsia-500/10 to-transparent",
    icon: "text-violet-600",
    dot: "bg-violet-600",
    badgeBg: "bg-violet-50",
  },
  cyan: {
    ring: "ring-cyan-500/25",
    halo: "from-cyan-500/18 via-teal-500/10 to-transparent",
    icon: "text-cyan-600",
    dot: "bg-cyan-600",
    badgeBg: "bg-cyan-50",
  },
};

const ProcessSection = () => {
  return (
    <section id="how-it-works" className="scroll-mt-24 relative py-20">
      {/* soft backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_50%_-10%,#e8f1ff_0%,transparent_55%)]"
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Fast & private
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            How It Works
          </h2>
        </div>

        <ol className="relative grid gap-10 md:grid-cols-3">
          {/* horizontal connector (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[86px] hidden h-[2px] w-[calc(100%-3rem)] -translate-x-1/2 md:block
                       bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          {STEPS.map(({ number, title, description, Icon, accent }, idx) => {
            const a = accentMap[accent];
            return (
              <li key={number} className="relative">
                {/* vertical connector (mobile) */}
                {idx !== STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-16 h-[calc(100%+2.5rem)] w-[2px] rounded bg-slate-200 md:hidden"
                  />
                )}

                <div className="group relative rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg focus-within:shadow-lg">
                  {/* soft color halo */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -inset-2 -z-10 rounded-2xl blur-2xl opacity-0 transition duration-300 group-hover:opacity-100 ring-1 ${a.ring}`}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.0), rgba(0,0,0,0.0))",
                    }}
                  />

                  <div className="flex items-start gap-4">
                    {/* number + icon badge */}
                    <div className="relative">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white text-lg font-semibold shadow-sm">
                        {number}
                      </span>
                      <span
                        className={`absolute -right-2 -bottom-2 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 ${a.badgeBg} text-slate-700 shadow-sm`}
                      >
                        <Icon className={`h-4 w-4 ${a.icon}`} />
                      </span>
                    </div>

                    <div className="pt-1">
                      <h3 className="text-base font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {description}
                      </p>

                      {/* micro trust chip */}
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 shadow-sm">
                        <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                        No tracking · No clutter
                      </div>
                    </div>
                  </div>

                  {/* top glow ribbon for readability */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent`}
                  />
                </div>

                {/* accent glow behind each card on hover */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -inset-3 -z-20 rounded-2xl opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 bg-gradient-to-br ${a.halo}`}
                />
              </li>
            );
          })}
        </ol>

        {/* tiny footnote / reassurance */}
        <p className="mt-10 text-center text-sm text-slate-500">
          Works with most public webpages. Private/content-locked pages may require access.
        </p>
      </div>
    </section>
  );
};

export default ProcessSection;
