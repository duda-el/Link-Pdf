import React from "react";
import { Link, FileDown, Wand2 } from "lucide-react";

/**
 * Modern stepper with responsive connectors:
 * - Mobile: vertical timeline
 * - Desktop: horizontal stepper
 * - Clean, “trustworthy SaaS” look
 */

type Step = {
  number: number;
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const STEPS: Step[] = [
  {
    number: 1,
    title: "Paste URL",
    description: "Drop any webpage link to start the conversion.",
    Icon: Link,
  },
  {
    number: 2,
    title: "Convert",
    description:
      "We render a distraction-free, reader-mode version of the page.",
    Icon: Wand2,
  },
  {
    number: 3,
    title: "Download",
    description: "Export a clean, printable PDF—ready for offline reading.",
    Icon: FileDown,
  },
];

const ProcessSection = () => {
  return (
    <section id="how-it-works" className="scroll-mt-24 relative py-20">
      {/* soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_50%_-10%,#e8f1ff_0%,transparent_55%)]"
      />

      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight md:text-4xl">
          How It Works
        </h2>

        {/* container switches layout with CSS only */}
        <ol className="relative grid gap-10 md:grid-cols-3">
          {/* horizontal connector line (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[84px] hidden h-[2px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent md:block"
          />

          {STEPS.map(({ number, title, description, Icon }, idx) => (
            <li key={number} className="relative">
              {/* vertical connector (mobile) */}
              {idx !== STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-6 top-16 h-[calc(100%+2.5rem)] w-[2px] rounded bg-slate-200 md:hidden"
                />
              )}

              <div className="group relative rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md">
                <div className="flex items-start gap-4">
                  {/* number + icon badge */}
                  <div className="relative">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white text-lg font-semibold shadow-sm">
                      {number}
                    </span>

                    <span className="absolute -right-2 -bottom-2 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="pt-1">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{description}</p>
                  </div>
                </div>

                {/* subtle glow on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(600px 120px at 20% 0%, rgba(59,130,246,.08), transparent 60%)",
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSection;
