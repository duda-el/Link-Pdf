import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BookOpen, Layers, Paintbrush } from "lucide-react";

type AccentKey = "blue" | "violet" | "cyan";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: AccentKey;
}

const accentStyles = (k: AccentKey) => {
  switch (k) {
    case "violet":
      return {
        halo: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
        ring: "ring-violet-500/20",
        iconWrap: "bg-violet-50",
        iconColor: "text-violet-600",
        dot: "bg-violet-600",
      };
    case "cyan":
      return {
        halo: "from-cyan-500/20 via-teal-500/10 to-transparent",
        ring: "ring-cyan-500/20",
        iconWrap: "bg-cyan-50",
        iconColor: "text-cyan-600",
        dot: "bg-cyan-600",
      };
    default:
      return {
        halo: "from-blue-500/20 via-sky-500/10 to-transparent",
        ring: "ring-blue-500/20",
        iconWrap: "bg-blue-50",
        iconColor: "text-blue-600",
        dot: "bg-blue-600",
      };
  }
};

const FeatureCard = ({
  icon,
  title,
  description,
  accent = "blue",
}: FeatureCardProps) => {
  const a = accentStyles(accent);

  return (
    <div className="group relative h-full">
      {/* soft glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br ${a.halo} blur-2xl opacity-0 transition duration-300 group-hover:opacity-100`}
      />
      {/* gradient ring */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-white/60 p-[1px] shadow-[0_1px_0_#fff_inset,0_1px_1px_rgba(0,0,0,0.04)]">
        <Card
          id="features"
          className={`h-full rounded-[1rem] border-slate-200/70 bg-white/80 backdrop-blur-sm transition duration-300 group-hover:translate-y-[-2px] group-hover:shadow-xl ring-1 ${a.ring}`}
        >
          <CardHeader className="pb-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${a.iconWrap} shadow-inner mb-4`}>
              {/* allow icon to inherit color on each card */}
              <div className={`${a.iconColor}`}>{icon}</div>
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-slate-600 leading-relaxed">
              {description}
            </CardDescription>

            {/* tiny footer chip */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 shadow-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
              Optimized export-ready
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Reader Mode",
      description:
        "Clean, distraction-free reading with beautiful typography. No ads, no popups—just the content you need.",
      accent: "blue" as AccentKey,
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Batch Export",
      description:
        "Convert multiple links into one organized PDF. Perfect for research packets, study sets, or briefing docs.",
      accent: "violet" as AccentKey,
    },
    {
      icon: <Paintbrush className="w-6 h-6" />,
      title: "Customization Options",
      description:
        "Tweak fonts, margins, headers, and layout. Save presets so every export matches your style.",
      accent: "cyan" as AccentKey,
    },
  ];

  return (
    <section id="features" className="relative py-20 px-4">
      {/* subtle background pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.06),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.06),transparent_45%)]"
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            New capabilities
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Powerful Features
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Everything you need to turn messy web pages into clean, export-ready PDFs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              icon={f.icon}
              title={f.title}
              description={f.description}
              accent={f.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
