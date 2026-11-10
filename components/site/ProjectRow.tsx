"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { useLocalLens } from "@/lib/lens";
import { LensSwitch } from "./LensSwitch";
import { Reveal } from "./Reveal";

export function ProjectRow({ p }: { p: Project }) {
  const [lens, setLens] = useLocalLens();
  return (
    <Reveal as="li" className="group grid-12 gap-y-5 border-t border-border py-10 md:py-14">
      <span className="eyebrow tnum col-span-12 text-accent-ink md:col-span-1 md:pt-4">{p.number}</span>
      <div className="col-span-12 md:col-span-5">
        <h3 className="font-display text-5xl text-foreground md:text-7xl">
          <Link
            href={`/work/${p.slug}`}
            className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px] focus-visible:bg-[length:100%_2px]"
          >
            {p.name}
          </Link>
        </h3>
        <p className="mt-3 text-lg text-foreground">{p.tagline}</p>
        <p className="eyebrow mt-4 text-muted-foreground">{p.sector}</p>
      </div>
      <div className="col-span-12 md:col-span-6">
        <LensSwitch value={lens} onChange={setLens} label={`Lens for ${p.name}`} size="sm" />
        <p key={lens} className="lens-fade mt-5 min-h-[7.5rem] max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {p.summary[lens]}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
          <Link href={`/work/${p.slug}`} className="group/l inline-flex min-h-11 items-center gap-2 text-accent-ink">
            <span className="link-underlined">Read the case</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-hover/l:translate-x-1">→</span>
          </Link>
          <Link href={p.demo} className="group/d inline-flex min-h-11 items-center gap-2 text-foreground">
            <span className="link-draw">Try the demo</span>
            <span aria-hidden className="transition-transform duration-300 group-hover/d:-translate-y-0.5 group-hover/d:translate-x-0.5">↗</span>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
