import Link from "next/link";
import Nav from "@/components/Nav";
import TraceDiagram from "@/components/TraceDiagram";
import Reveal from "@/components/Reveal";
import Buttons from "@/components/Buttons";
import { Contact, Footer } from "@/components/Footer";
import { about, education, experience, moreProjects, projects, site, skills } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="wrap">
        <section id="top" className="hero">
          <div className="hero-text">
            <p className="run-id">
              run_id: shashank-kanangi · status: building<span className="cursor" />
            </p>
            <h1>{site.headline}</h1>
            <p className="hero-intro">{site.intro}</p>
            <Buttons />
          </div>
          <TraceDiagram />
        </section>

        <section id="work" className="section">
          <div className="work-head">
            <div>
              <p className="label">output:</p>
              <h2 className="h2">The trace</h2>
            </div>
            <p className="mono" style={{ margin: 0, fontSize: 13, color: "var(--faint)" }}>
              {projects.length} featured steps · {moreProjects.length} earlier steps
            </p>
          </div>

          {projects.map((p) => (
            <Reveal as="article" key={p.slug} className="step">
              <div className="step-rail">
                <span className="step-num">{p.step}</span>
                <span className="step-line" />
              </div>
              <div className="step-body">
                <div className="step-main reveal-child">
                  <p className="step-agent">{p.agentLabel}</p>
                  <h3>
                    <Link href={`/projects/${p.slug}`}>
                      {p.name} <span className="arrow">→</span>
                    </Link>
                  </h3>
                  <p className="step-text">{p.cardText}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
                    <Link href={`/projects/${p.slug}`} className="step-more">
                      read the full trace →
                    </Link>
                    {p.demo && (
                      <Link href={p.demo} className="step-more">
                        ▶ try the demo
                      </Link>
                    )}
                  </div>
                </div>
                <div className="facts">
                  {p.facts.map((f) => (
                    <div className="row" key={f.label}>
                      <span className="k">{f.label}</span>
                      <span>{f.value}</span>
                    </div>
                  ))}
                  {p.outcome && (
                    <div className="row outcome">
                      <span className="k" style={{ color: "var(--ok)" }}>
                        result
                      </span>
                      <span>{p.outcome}</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal as="article" className="step">
            <div className="step-rail">
              <span className="step-num dashed">+{moreProjects.length}</span>
            </div>
            <div className="more-grid">
              {moreProjects.map((m) => (
                <div className="mini" key={m.name}>
                  <b>{m.name}</b>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <Reveal as="section" id="about" className="section split reveal">
          <div className="split-head">
            <p className="label">context:</p>
            <h2 className="h2">About me</h2>
          </div>
          <div className="split-body">
            {about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <section id="experience" className="section">
          <p className="label">history:</p>
          <h2 className="h2">Experience</h2>
          <div className="xp">
            {experience.map((x, i) => (
              <Reveal key={x.role} className="xp-row reveal" delay={i * 80}>
                <span className="xp-when">{x.when}</span>
                <div className="xp-main">
                  <span className="xp-role">{x.role}</span>
                  <span className="xp-org">{x.org}</span>
                  {x.text && <span className="xp-text">{x.text}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="education" className="section">
          <p className="label">training_data:</p>
          <h2 className="h2">Education</h2>
          <div className="edu">
            {education.map((e, i) => (
              <Reveal key={e.degree} className="card reveal" delay={i * 100}>
                <span className="when">{e.when}</span>
                <span className="title">{e.degree}</span>
                <span className="org">{e.school}</span>
                <span className="text">{e.text}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <p className="label">tools:</p>
          <h2 className="h2">Skills</h2>
          <div className="skills">
            {skills.map((s) => (
              <div key={s.group}>
                <span className="k">{s.group}</span>
                <span>{s.items}</span>
              </div>
            ))}
          </div>
        </section>

        <Contact />
        <Footer />
      </main>
    </>
  );
}
