"use client";

import type { Lens } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function LensSwitch({ value, onChange, label, size = "md", className }: {
  value: Lens; onChange: (l: Lens) => void; label: string; size?: "sm" | "md"; className?: string;
}) {
  const opts: { v: Lens; t: string }[] = [{ v: "business", t: "Business" }, { v: "technical", t: "Technical" }];
  return (
    <div role="radiogroup" aria-label={label} className={cn("relative inline-grid grid-cols-2 rounded-full border border-foreground/80 p-[3px]", className)}>
      <span
        aria-hidden
        className="absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ transform: value === "technical" ? "translateX(100%)" : "none" }}
      />
      {opts.map((o) => {
        const on = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.v)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                onChange(o.v === "business" ? "technical" : "business");
              }
            }}
            tabIndex={on ? 0 : -1}
            className={cn(
              "relative z-10 cursor-pointer rounded-full font-medium transition-colors duration-300",
              size === "sm" ? "min-h-8 px-3 py-1 text-xs" : "min-h-9 px-4 py-1.5 text-sm",
              on ? "text-accent-foreground" : "text-foreground hover:text-accent-ink",
            )}
          >
            {o.t}
          </button>
        );
      })}
    </div>
  );
}
