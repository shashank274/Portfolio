"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LensSwitch } from "./LensSwitch";
import { useGlobalLens } from "@/lib/lens";
import { cn } from "@/lib/utils";

const NAV = [
  { hash: "work", label: "Work" },
  { hash: "about", label: "About" },
  { hash: "experience", label: "Experience" },
  { hash: "contact", label: "Contact" },
];

export function Header() {
  const { lens, setLens } = useGlobalLens();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setCompact(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 border-b bg-[rgba(244,240,232,0.96)] backdrop-blur-sm transition-all duration-300", compact ? "border-border" : "border-transparent")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-background focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className={cn("container-x flex items-center justify-between gap-4 transition-all duration-300", compact ? "h-14" : "h-20")}>
        <Link href="/" className={cn("font-display text-foreground transition-all", compact ? "text-xl" : "text-2xl")}>
          Shashank Kanangi
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link key={n.hash} href={`/#${n.hash}`} className="link-draw text-sm text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LensSwitch value={lens} onChange={setLens} label="Default lens for the whole site" size="sm" />
          </div>
          <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="menu" className="min-h-11 cursor-pointer px-2 text-sm font-medium text-foreground lg:hidden">
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div id="menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex h-dvh flex-col bg-background">
          <div className="container-x flex h-20 items-center justify-between">
            <span className="font-display text-2xl">Shashank Kanangi</span>
            <button type="button" autoFocus onClick={() => setOpen(false)} className="min-h-11 cursor-pointer px-2 text-sm font-medium">
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="container-x mt-6 flex flex-col">
            {NAV.map((n, i) => (
              <Link
                key={n.hash}
                href={`/#${n.hash}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-t border-border py-5 font-display text-5xl text-foreground"
              >
                <span className="eyebrow tnum text-accent-ink">0{i + 1}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="container-x mt-auto pb-10">
            <p className="eyebrow mb-3 text-muted-foreground">Read the projects as</p>
            <LensSwitch value={lens} onChange={setLens} label="Default lens for the whole site" />
          </div>
        </div>
      )}
    </header>
  );
}
