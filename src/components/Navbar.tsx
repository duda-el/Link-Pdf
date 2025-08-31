"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/app/appLogo.png";

const links = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

const PENDING_KEY = "__pending_scroll_to_hash";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  // keep URL clean: remove any #hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) history.replaceState(null, "", "/");
  }, []);

  const sectionIds = useMemo(
    () => links.filter((l) => l.href.startsWith("#")).map((l) => l.href),
    []
  );

  // When route becomes "/", check for a pending target and scroll to it
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/") return;

    // handle "return to home then scroll"
    const pending = sessionStorage.getItem(PENDING_KEY);
    if (pending) {
      // give the home content a tick to render
      setTimeout(() => {
        const el = document.querySelector(pending);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveHash(pending);
          history.replaceState(null, "", "/"); // keep url as "/"
        }
        sessionStorage.removeItem(PENDING_KEY);
      }, 50);
    }
  }, [pathname]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // in-page sections: smooth scroll WITHOUT changing URL
    if (href.startsWith("#")) {
      e.preventDefault();

      // if we're not on "/", navigate to "/" first and then scroll
      if (pathname !== "/") {
        sessionStorage.setItem(PENDING_KEY, href);
        router.push("/");
        setOpen(false);
        return;
      }

      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveHash(href);
        history.replaceState(null, "", "/"); // keep url as "/"
      }
      setOpen(false);
      return;
    }

    // home link: scroll to top, keep `/`, reset active
    if (href === "/") {
      e.preventDefault();
      if (pathname !== "/") {
        router.push("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setActiveHash("");
      history.replaceState(null, "", "/");
      setOpen(false);
      return;
    }

    setOpen(false);
  };

  // Logo click: HARD reload, go to top
  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "/"; // forces reload + top of page
  };

  // Scroll spy
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (visible?.target as HTMLElement | undefined)?.id;
        if (id) setActiveHash("#" + id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const els = sectionIds
      .map((id) => document.querySelector(id))
      .filter(Boolean) as Element[];

    els.forEach((el) => observer.observe(el));

    // also handle "near top" → highlight Home
    const onScrollTopCheck = () => {
      const y = window.scrollY || 0;
      if (y < 60) {
        // small threshold so Home becomes active when back at top
        setActiveHash("");
      }
    };
    window.addEventListener("scroll", onScrollTopCheck, { passive: true });
    onScrollTopCheck();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollTopCheck);
    };
  }, [sectionIds]);

  // Shadow + progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      const doc = document.documentElement;
      const h = doc.scrollHeight - doc.clientHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = href.startsWith("#")
      ? activeHash === href
      : href === "/"
      ? pathname === "/" && activeHash === ""
      : pathname === href;

    return (
      <a
        href={href}
        onClick={(e) => handleClick(e, href)}
        className={`relative px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
        <span
          className={`absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full transition-all ${
            isActive ? "bg-slate-900 opacity-100" : "opacity-0"
          }`}
        />
      </a>
    );
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      {/* progress bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600"
        style={{ width: `${progress}%`, transition: "width 80ms linear" }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-5">
        {/* Left: Logo (reload) */}
        <div className="flex flex-1">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2"
            aria-label="Reload homepage"
          >
            <Image
              src={Logo}
              alt="Link2PDF logo"
              width={32}
              height={32}
              priority
              className="h-9.5 w-8"
            />
          </a>
        </div>

        {/* Center: Nav links */}
        <div className="relative hidden md:flex flex-1 items-center justify-center gap-1">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
          <span ref={indicatorRef} className="sr-only" />
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          <Link
            href="/signin"
            className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border md:hidden"
        >
          {open ? <MenuClose /> : <MenuOpen />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="mx-3 mb-3 rounded-lg border bg-white/90 p-3 shadow-lg backdrop-blur">
          <div className="flex flex-col space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleClick(e, l.href)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  (l.href.startsWith("#")
                    ? activeHash === l.href
                    : pathname === l.href)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:brightness-110"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuOpen() {
  return <Menu className="h-5 w-5" />;
}
function MenuClose() {
  return <X className="h-5 w-5" />;
}
