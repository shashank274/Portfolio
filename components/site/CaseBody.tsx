"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { useLocalLens } from "@/lib/lens";
import { LensSwitch } from "./LensSwitch";
import { Diagram } from "./Diagram";
import { Reveal } from "./Reveal";

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid-12 gap-y-4 border-t border-border py-10">
      <div className="col-span-12 flex items-baseline gap-3 md:col-span-4">
        <span className="eyebrow tnum text-accent-ink">0{n}</span>
        <h2 className="font-display text-3xl text-foreground md:text-4xl">{title}</h2>
      </div>
      <div className="col-span-12 md:col-span-8">{children}</div>
    </Reveal>
  );
}

export function CaseBody({ p, next }: { p: Project; next: Project }) {
  const [lens, setLens] = useLocalLens();
  const txt = "max-w-2xl text-lg leading-relaxed text-muted-foreground";

  return (
    <article className="container-x pb-20 pt-10 md:pt-16">
      <Link href="/#work" className="link-draw text-sm text-muted-foreground">
        ← All work
      </Link>
      <header className="mt-10 border-b border-foreground pb-10">
        <p className="eyebrow text-accent-ink">
          <span className="tnum">{p.number}</span> · {p.sector}
        </p>
        <h1 className="font-display mt-4 text-6xl text-foreground sm:text-8xl lg:text-[9rem]">{p.name}</h1>
        <p className="mt-4 max-w-2xl text-xl text-foreground">{p.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LensSwitch value={lens} onChange={setLens} label={`Lens for ${p.name}`} />
          <Link
            href={p.demo}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-accent-ink"
          >
            Try the interactive demo <span aria-hidden>↗</span>
          </Link>
          <span className="text-sm text-muted-foreground">Runs in your browser with sample data</span>
        </div>
      </header>

      <div key={lens} className="lens-fade" aria-live="polite">
        {lens === "business" ? (
          <>
            <Block n={1} title="The problem"><p className={txt}>{p.business.problem}</p></Block>
            <Block n={2} title="Who it was for"><p className={txt}>{p.business.who}</p></Block>
            <Block n={3} title="What I did"><p className={txt}>{p.business.did}</p></Block>
            <Block n={4} title="What changed">
              <p className="font-display max-w-2xl text-3xl leading-tight text-foreground md:text-4xl">{p.business.changed}</p>
            </Block>
            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
              Want the architecture?{" "}
              <button type="button" onClick={() => setLens("technical")} className="link-underlined cursor-pointer text-accent-ink">
                Switch to the technical lens
              </button>
            </p>
          </>
        ) : (
          <>
            <Block n={1} title="Architecture"><Diagram rows={p.technical.architecture} /></Block>
            <Block n={2} title="How it works">
              <ol className="space-y-6">
                {p.technical.steps.map((s, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="font-display tnum text-4xl leading-none text-accent">{i + 1}</span>
                    <p className={txt}>{s}</p>
                  </li>
                ))}
              </ol>
            </Block>
            <Block n={3} title="Key pieces">
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {p.technical.pieces.map((k) => (
                  <div key={k.title} className="border-t border-border pt-3">
                    <dt className="font-medium text-foreground">{k.title}</dt>
                    <dd className="mt-1 leading-relaxed text-muted-foreground">{k.text}</dd>
                  </div>
                ))}
              </dl>
            </Block>
            <Block n={4} title="Stack">
              <ul className="flex flex-wrap gap-2">
                {p.technical.stack.map((s) => (
                  <li key={s} className="rounded-full border border-foreground/70 px-3 py-1 text-sm text-foreground">{s}</li>
                ))}
              </ul>
            </Block>
            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
              Want the business story?{" "}
              <button type="button" onClick={() => setLens("business")} className="link-underlined cursor-pointer text-accent-ink">
                Switch to the business lens
              </button>
            </p>
          </>
        )}
      </div>

      <nav aria-label="Next case" className="mt-10 border-t border-foreground pt-10">
        <Link href={`/work/${next.slug}`} className="group block">
          <span className="eyebrow text-muted-foreground">Next case →</span>
          <span className="font-display mt-3 flex items-baseline gap-4 text-5xl text-foreground md:text-7xl">
            <span className="link-draw">{next.name}</span>
            <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-2">→</span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
