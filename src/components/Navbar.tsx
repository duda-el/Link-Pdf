"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/app/appLogo.png";

const links = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // in-page anchors → smooth scroll + set active
    if (href.startsWith("#")) {
      e.preventDefault();
      setActiveHash(href);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
      return;
    }

    // home → scroll top, clear active
    if (href === "/") {
      e.preventDefault();
      setActiveHash("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setOpen(false);
      return;
    }

    // other routes (signin/signup)
    setOpen(false);
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    // Active rule:
    // - hash links: active when activeHash === href
    // - home: active only when we're on "/" AND no activeHash selected
    // - other routes: active when pathname matches
    const isActive = href.startsWith("#")
      ? activeHash === href
      : href === "/"
      ? pathname === "/" && activeHash === ""
      : pathname === href;

    return (
      <a
        href={href}
        onClick={(e) => handleClick(e, href)}
        className={`px-3 py-2 text-sm font-medium transition ${
          isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        {/* Logo (also clears active and scrolls top) */}
        <a
          href="/"
          onClick={(e) => handleClick(e, "/")}
          className="flex items-center gap-2"
        >
          <Image
            src={Logo}
            alt="Link2PDF logo"
            width={28}
            height={28}
            priority
            className="h-9.5 w-8"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </div>

        {/* Right side buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/signin"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div className="mx-3 mb-3 rounded-md border bg-white p-3 shadow-lg backdrop-blur">
            <div className="flex flex-col space-y-2">
              {links.map((l) => (
                <NavLink key={l.href} {...l} />
              ))}
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
