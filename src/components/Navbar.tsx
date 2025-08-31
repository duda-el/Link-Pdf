"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "@/app/appLogo.png";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Profile = { full_name: string | null; avatar_url: string | null };

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

  // -------- AUTH STATE --------
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const sb = supabaseBrowser();

    const load = async () => {
      try {
        // hydrate cookie session into the browser client
        await sb.auth.getSession();

        const {
          data: { user },
        } = await sb.auth.getUser();
        setUserId(user?.id ?? null);

        if (user?.id) {
          const { data, error } = await sb
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();

          if (error) {
            console.warn("profiles fetch error:", error.message);
            setProfile(null);
          } else {
            setProfile(data);
          }
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("auth load error:", e);
        setUserId(null);
        setProfile(null);
      } finally {
        setAuthLoading(false);
      }
    };

    load();

    // react to sign-in/out immediately
    const { data: sub } = sb.auth.onAuthStateChange(async () => {
      setAuthLoading(true);
      await load();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabaseBrowser().auth.signOut();
    setOpen(false);
    router.refresh();
    router.push("/");
  };

  // -------- NAV / UI BEHAVIOR --------

  // keep URL clean: remove any #hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) history.replaceState(null, "", "/");
  }, []);

  const sectionIds = useMemo(
    () => links.filter((l) => l.href.startsWith("#")).map((l) => l.href),
    []
  );

  // When route becomes "/", check pending hash and scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/") return;

    const pending = sessionStorage.getItem(PENDING_KEY);
    if (pending) {
      setTimeout(() => {
        const el = document.querySelector(pending);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveHash(pending);
          history.replaceState(null, "", "/");
        }
        sessionStorage.removeItem(PENDING_KEY);
      }, 50);
    }
  }, [pathname]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
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
        history.replaceState(null, "", "/");
      }
      setOpen(false);
      return;
    }

    if (href === "/") {
      e.preventDefault();
      if (pathname !== "/") router.push("/");
      else window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveHash("");
      history.replaceState(null, "", "/");
      setOpen(false);
      return;
    }

    setOpen(false);
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "/";
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

    const onScrollTopCheck = () => {
      const y = window.scrollY || 0;
      if (y < 60) setActiveHash("");
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

  // Right: Auth area (DEBUG)
  const sb = supabaseBrowser();
  const [dbg, setDbg] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        await sb.auth.getSession(); // 1) hydrate
        const {
          data: { user },
        } = await sb.auth.getUser();
        if (user) {
          const { data } = await sb
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();
          setDbg({ userId: user.id, profile: data });
        } else {
          setDbg({ userId: null, profile: null });
        }
      } catch (e) {
        setDbg({ error: String(e) });
      }
    })();
  }, []);

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
        {/* Left: Logo */}
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

        {/* Right: Auth area */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          {!dbg ? (
            <div className="h-9 w-28 animate-pulse rounded-md" />
          ) : dbg.userId && dbg.profile ? (
            <div className="flex items-center gap-3">
              {/* use plain <img> temporarily to rule out next/image */}
              <img
                src={dbg.profile.avatar_url || "/avatar-fallback.png"}
                width={28}
                height={28}
                style={{ borderRadius: 9999, objectFit: "cover" }}
                alt="avatar"
              />
              <span className="text-sm font-medium text-slate-800">
                {dbg.profile.full_name || "Account"}
              </span>
              <button
                onClick={async () => {
                  await supabaseBrowser().auth.signOut();
                  router.refresh();
                }}
                className="inline-flex items-center justify-center rounded-full text-slate-600 hover:text-red-600"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
              onClick={() => setOpen(false)}
            >
              Get started
            </Link>
          )}
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
                  (
                    l.href.startsWith("#")
                      ? activeHash === l.href
                      : pathname === l.href
                  )
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </a>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-2">
              {userId && profile ? (
                <>
                  <div className="col-span-2 flex items-center gap-3 rounded-md border px-3 py-2">
                    <Image
                      src={profile.avatar_url || "/avatar-fallback.png"}
                      alt="avatar"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">
                      {profile.full_name || "Account"}
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="rounded-md border px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="col-span-2 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:brightness-110"
                >
                  Get started
                </Link>
              )}
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
