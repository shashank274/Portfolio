import { earlierWork, LINKS, projects } from "@/lib/projects";
import { ProjectRow } from "@/components/site/ProjectRow";
import { Reveal } from "@/components/site/Reveal";
import { CountUp } from "@/components/site/CountUp";
import { RouteLine } from "@/components/site/RouteLine";
import { Section, SectionHead } from "@/components/site/Section";
import Image from "next/image";

const NUMBERS = [
  { v: "80%", t: "less manual bank reconciliation work after the matching engine I built" },
  { v: "95%+", t: "accuracy of the OCR brand checks in Pearity.ai" },
  { v: "4", t: "AI systems built at Plenum, one live in production" },
  { v: "Top 5%", t: "of my BSc cohort; now on the Amsterdam Merit Scholarship" },
];

const BRING = [
  { h: "I start from the business problem.", t: "I built the reconciliation engine together with finance stakeholders and the ERP team, so it fitted how they actually close the books." },
  { h: "I build things that ship.", t: "Four AI systems at Plenum, one of them live in production. I built Hoistra, Trace Lab and the ERP suite myself, and worked on the backend of Pearity." },
  { h: "I care whether people can trust the AI.", t: "Human approval steps in Hoistra, step-by-step review in Trace Lab, and a real interest in how organisations adopt AI responsibly." },
];

const EXPERIENCE = [
  { d: "Apr 2025 – May 2026", r: "Data Scientist & AI Engineer", o: "Plenum Technologies, Dubai", t: "Built Hoistra, Trace Lab and the ERP-AI suite, and worked on the backend of Pearity.ai. Built the reconciliation matching engine together with finance stakeholders and the ERP team." },
  { d: "2026 – now", r: "Student Ambassador", o: "University of Amsterdam, Faculty of Economics and Business" },
  { d: "Oct 2024 – Jun 2025", r: "Treasurer", o: "IEEE Women in Engineering, Dubai" },
  { d: "Jul – Aug 2024", r: "Data Science Intern", o: "Redington Gulf, Dubai", t: "Customer segmentation and market basket analysis on enterprise sales data, turned into marketing recommendations." },
];

const EDUCATION = [
  { d: "2026 – 2027", r: "MSc Business IT Management", o: "University of Amsterdam", t: "Amsterdam Merit Scholarship (full tuition plus a living allowance). Courses include Data Science and AI for Business, Digital Transformation, and Change Management and Consultancy." },
  { d: "2022 – 2025", r: "BSc Information Systems & Management", o: "Manipal Academy of Higher Education, Dubai", t: "CGPA 9.15/10, top 5% of the cohort. Best Poster Award for the capstone; 2nd place nationally in the MakeX Robotics Competition." },
];

const CERTS = [
  { d: "Nov 2026", r: "AWS Certified AI Business Strategist", o: "Amazon Web Services", t: "Business track. Earned as an early adopter of the certification." },
  { d: "Sep 2026", r: "Claude Academy: AI Fluency for Builders", o: "Anthropic" },
  { d: "Sep 2026", r: "Claude Academy: Claude 101", o: "Anthropic" },
];

const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors";

function Timeline({ items }: { items: { d: string; r: string; o: string; t?: string }[] }) {
  return (
    <ol>
      {items.map((e, i) => (
        <Reveal as="li" key={e.r + e.d} delay={i * 60} className="grid-12 gap-y-2 border-t border-border py-7">
          <p className="tnum col-span-12 text-sm text-muted-foreground md:col-span-3">{e.d}</p>
          <div className="col-span-12 md:col-span-9">
            <h3 className="font-display text-3xl text-foreground">{e.r}</h3>
            <p className="mt-1 text-foreground">{e.o}</p>
            {e.t && <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{e.t}</p>}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container-x pb-16 pt-10 md:pb-24 md:pt-20">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <Reveal as="p" className="eyebrow max-w-xl leading-relaxed text-muted-foreground">
              Data Scientist &amp; AI Engineer · MSc Business IT Management, University of Amsterdam
            </Reveal>
            <Reveal as="h1" delay={100} className="font-display mt-6 text-[3.25rem] text-foreground sm:text-7xl lg:text-[6.5rem]">
              I turn messy business problems into AI that people <em className="text-accent">actually</em> use.
            </Reveal>
            <Reveal as="p" delay={220} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              I spent just over a year at Plenum Technologies in Dubai building AI systems for finance teams, facilities teams and marketing agencies, one of them now live in production. Now I&apos;m in Amsterdam doing my master&apos;s, and open to roles in the Netherlands and the UAE.
            </Reveal>
            <Reveal delay={320} className="mt-10 flex flex-wrap gap-3">
              <a href="#work" className={`${btn} bg-foreground text-background hover:bg-accent-ink`}>
                See my work <span aria-hidden>↓</span>
              </a>
              <a href={`mailto:${LINKS.email}`} className={`${btn} border border-foreground text-foreground hover:bg-foreground hover:text-background`}>
                Email me
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className={`${btn} text-foreground hover:text-accent-ink`}>
                <span className="link-draw">LinkedIn</span> <span aria-hidden>↗</span>
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className={`${btn} text-foreground hover:text-accent-ink`}>
                <span className="link-draw">GitHub</span> <span aria-hidden>↗</span>
              </a>
            </Reveal>
          </div>
          <div className="col-span-12 self-end sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9">
            <RouteLine />
          </div>
        </div>
      </section>

      {/* Key numbers */}
      <section aria-label="Key numbers" className="border-y border-foreground">
        <ul className="container-x grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {NUMBERS.map((n, i) => (
            <Reveal
              as="li"
              key={n.v}
              delay={i * 80}
              className="border-border py-8 max-sm:border-t max-sm:first:border-t-0 sm:px-6 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0 lg:first:pl-0"
            >
              <CountUp value={n.v} className="font-display tnum block text-7xl text-accent md:text-8xl" />
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">{n.t}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 01 Work */}
      <Section id="work">
        <SectionHead n="01" title="Selected work" />
        <p className="-mt-4 mb-6 max-w-2xl text-muted-foreground md:-mt-8">
          Each project can be read two ways. <strong className="font-medium text-foreground">Business</strong> shows the problem and what changed;{" "}
          <strong className="font-medium text-foreground">Technical</strong> shows how it&apos;s built. Every one has a clickable demo with sample data.
        </p>
        <ul>
          {projects.map((p) => (
            <ProjectRow key={p.slug} p={p} />
          ))}
        </ul>
        <div className="grid-12 mt-16 gap-y-6 border-t border-foreground pt-8">
          <h3 className="eyebrow col-span-12 text-foreground md:col-span-3">Earlier work</h3>
          <ul className="col-span-12 md:col-span-9">
            {earlierWork.map((w) => (
              <Reveal as="li" key={w.name} className="grid gap-1 border-b border-border py-5 md:grid-cols-[18rem_1fr] md:gap-8">
                <p className="font-medium text-foreground">
                  {w.href ? (
                    <a href={w.href} target="_blank" rel="noreferrer" className="link-draw">
                      {w.name} <span aria-hidden className="text-accent-ink">↗</span>
                    </a>
                  ) : (
                    w.name
                  )}
                </p>
                <p className="leading-relaxed text-muted-foreground">{w.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* 02 Bring */}
      <Section>
        <SectionHead n="02" title="What I bring" />
        <div className="grid-12 gap-y-12">
          {BRING.map((b, i) => (
            <Reveal key={b.h} delay={i * 100} className="col-span-12 md:col-span-4">
              <span className="eyebrow tnum text-accent-ink">{String.fromCharCode(97 + i)}.</span>
              <h3 className="font-display mt-3 text-4xl text-foreground">{b.h}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{b.t}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 03 About */}
      <Section id="about">
        <SectionHead n="03" title="About" />
        <div className="grid-12 gap-y-10">
          <Reveal as="p" className="font-display col-span-12 text-3xl leading-[1.15] text-foreground md:text-5xl lg:col-span-9">
            I was born and brought up in Dubai and moved to Amsterdam in 2026 for an MSc in Business IT Management at the University of Amsterdam, on the Amsterdam Merit Scholarship. Before that I spent just over a year at Plenum Technologies as a Data Scientist and AI Engineer. What interests me most is the human side of AI: how organisations adopt it, and how people can check and trust what it does. That&apos;s why I&apos;m drawn to both AI engineering and tech consulting.
          </Reveal>
          <div className="col-span-12 space-y-8 lg:col-span-3 lg:pt-3">
            <div>
              <p className="eyebrow text-muted-foreground">Open to roles in</p>
              <p className="mt-3 text-foreground">The Netherlands and the UAE</p>
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Languages</p>
              <p className="mt-3 text-foreground">English, Hindi, Tulu, Kannada</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 04 Experience */}
      <Section id="experience">
        <SectionHead n="04" title="Experience" />
        <Timeline items={EXPERIENCE} />
      </Section>

      {/* 05 Education */}
      <Section>
        <SectionHead n="05" title="Education" />
        <Timeline items={EDUCATION} />
      </Section>

      {/* 06 Certifications */}
      <Section id="certifications">
        <SectionHead n="06" title="Certifications" />
        <div className="grid-12 gap-y-10">
          <Reveal className="col-span-12 flex flex-col items-start gap-5 md:col-span-4">
            <Image
              src="/certs/aws-ai-business-strategist.png"
              alt="AWS Certified AI Business Strategist badge"
              width={600}
              height={600}
              className="h-auto w-40 md:w-52"
            />
            <p className="eyebrow text-accent-ink">Latest · Early adopter</p>
          </Reveal>
          <div className="col-span-12 md:col-span-8">
            <ol>
              {CERTS.map((c, i) => (
                <Reveal as="li" key={c.r} delay={i * 60} className="grid-12 gap-y-2 border-t border-border py-7 first:border-t-0 first:pt-0 md:first:pt-2">
                  <p className="tnum col-span-12 text-sm text-muted-foreground md:col-span-3">{c.d}</p>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="font-display text-3xl text-foreground">{c.r}</h3>
                    <p className="mt-1 text-foreground">{c.o}</p>
                    {c.t && <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{c.t}</p>}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* 07 Skills */}
      <Section>
        <SectionHead n="07" title="Skills" />
        <div className="grid-12 gap-y-10">
          <Reveal className="col-span-12 md:col-span-6">
            <h3 className="font-display text-3xl text-foreground">Business &amp; consulting</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Working with finance stakeholders and ERP teams, process automation, ERP (Microsoft Dynamics 365 / Business Central), Power BI reporting, customer segmentation and marketing analysis. MSc coursework in digital transformation and change management.
            </p>
          </Reveal>
          <Reveal delay={100} className="col-span-12 md:col-span-6">
            <h3 className="font-display text-3xl text-foreground">Technical</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Python, Go, SQL, FastAPI, LangChain, LangGraph, AutoGen, RAG, MCP, Azure (Container Apps, DevOps, AI Services), PostgreSQL, Redis, Docker, OpenTelemetry.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Contact */}
      <section id="contact" className="container-x border-t border-foreground py-20 md:py-32">
        <p className="eyebrow text-accent-ink">Contact</p>
        <Reveal as="h2" className="font-display mt-6 text-7xl text-foreground md:text-[9rem]">
          Let&apos;s talk.
        </Reveal>
        <Reveal delay={120}>
          <a href={`mailto:${LINKS.email}`} className="link-draw font-display mt-8 inline-block break-all text-3xl text-accent-ink sm:text-5xl md:text-6xl">
            {LINKS.email}
          </a>
        </Reveal>
        <p className="mt-8 text-muted-foreground">Based in Amsterdam · Open to roles in the Netherlands and the UAE</p>
        <ul className="mt-6 flex gap-8 font-medium">
          <li>
            <a className="link-draw inline-flex min-h-11 items-center text-foreground" href={LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a className="link-draw inline-flex min-h-11 items-center text-foreground" href={LINKS.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
