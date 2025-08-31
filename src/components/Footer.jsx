"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";
import Logo from "@/app/appLogo.png";

const links = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          {/* left: logo + brand */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">
              Link2PDF
            </span>
          </div>

          {/* center: nav */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="hover:text-slate-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* right: socials */}
          <div className="flex items-center gap-3 text-slate-500">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-slate-900 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-slate-900 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@example.com"
              aria-label="Email"
              className="hover:text-slate-900 transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Link2PDF. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
