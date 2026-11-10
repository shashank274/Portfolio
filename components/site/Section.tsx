import type { ReactNode } from "react";

export function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4 border-t border-foreground pt-4 md:mb-16">
      <span className="eyebrow tnum text-accent-ink">{n}</span>
      <h2 className="eyebrow text-foreground">{title}</h2>
    </div>
  );
}

export function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="container-x py-16 md:py-28">
      {children}
    </section>
  );
}
