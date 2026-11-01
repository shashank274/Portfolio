import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { Contact, Footer } from "@/components/Footer";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    openGraph: { title: `${p.name} · Shashank Kanangi`, description: p.summary, url: `/projects/${p.slug}`, images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <Nav home={false} />
      <main className="wrap">
        <header className="p-head">
          <p className="label" style={{ margin: 0 }}>
            step {p.step} / {String(projects.length).padStart(2, "0")} · {p.kind.toLowerCase()}
          </p>
          <h1>{p.name}</h1>
          <p className="p-summary">{p.summary}</p>
          <div className="meta">
            {p.meta.map((m) => (
              <div key={m.label}>
                <span className="k">{m.label}</span>
                <span className="v">{m.value}</span>
              </div>
            ))}
          </div>
        </header>

        <Reveal as="section" className="p-section split reveal">
          <div className="split-head">
            <p className="label">input:</p>
            <h2 className="h2" style={{ fontSize: 40 }}>
              The problem
            </h2>
          </div>
          <div className="split-body">
            {p.problem.map((t, k) => (
              <p key={k}>{t}</p>
            ))}
          </div>
        </Reveal>

        <section className="p-section">
          <div className="split">
            <div className="split-head">
              <p className="label">process:</p>
              <h2 className="h2" style={{ fontSize: 40 }}>
                How it works
              </h2>
            </div>
            <div className="split-body">
              <p>{p.howIntro}</p>
            </div>
          </div>

          <Reveal className="reveal">
            <figure className="arch">
              {p.diagram.layers.map((layer, li) => {
                const last = li === p.diagram.layers.length - 1;
                const many = layer.length > 4;
                const prevMany = li > 0 && p.diagram.layers[li - 1].length > 1;
                return (
                  <div key={li} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {li > 0 && (
                      <>
                        {prevMany && <div className="arch-bus" style={{ marginTop: 18 }} />}
                        <div className="arch-wire" />
                        {layer.length > 1 && <div className="arch-bus" />}
                        {layer.length > 1 && <div style={{ height: 18 }} />}
                      </>
                    )}
                    <div className={`arch-row ${many ? "many" : ""} ${last && li > 1 ? "base" : ""}`}>
                      {layer.map((n) => (
                        <div key={n.label} className={`arch-node ${n.highlight ? "hl" : ""}`}>
                          <b>{n.label}</b>
                          {n.note && <span>{n.note}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <figcaption>{p.diagram.caption}</figcaption>
            </figure>
          </Reveal>

          <div className="flow">
            {p.flow.map((f, k) => (
              <Reveal key={f.title} className="reveal" delay={k * 90}>
                <span className="t">
                  {k + 1} · {f.title}
                </span>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="p-section">
          <p className="label">details:</p>
          <h2 className="h2" style={{ fontSize: 40 }}>
            Key pieces
          </h2>
          <div className="pieces">
            {p.pieces.map((x, k) => (
              <Reveal key={x.title} className="card reveal" delay={(k % 2) * 90}>
                <span className="title">{x.title}</span>
                <span className="text">{x.text}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="p-section split">
          <div className="split-head">
            <p className="label">tools:</p>
            <h2 className="h2" style={{ fontSize: 40 }}>
              Stack
            </h2>
          </div>
          <div className="split-body" style={{ gap: 0 }}>
            <div className="stack">
              {p.stack.map((s) => (
                <div key={s.label}>
                  <span className="k">{s.label}</span>
                  <span className="v">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-next">
          <Link href="/#work" className="btn">
            ← All projects
          </Link>
          <Link href={`/projects/${next.slug}`} className="p-next-link">
            <span className="k">next step · {next.step}</span>
            <span className="v">
              {next.name} <span>→</span>
            </span>
          </Link>
        </section>

        <Contact />
        <Footer />
      </main>
    </>
  );
}
