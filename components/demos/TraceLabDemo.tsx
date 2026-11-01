"use client";

import { useMemo, useRef, useState } from "react";
import DemoBar from "./DemoBar";

/* ---------------- sample runs (all made up) ---------------- */

type Step = { id: string; kind: "route" | "agent" | "llm" | "db" | "doc" | "answer"; title: string; agent?: string; input: string; output: string; ms: number };
type Run = { id: string; question: string; when: string; agents: string[]; steps: Step[]; flagged?: boolean };

const RUNS: Run[] = [
  {
    id: "run-0412", question: "How many open work orders does Canal Point have?", when: "today 10:42", agents: ["work orders", "database reader"], flagged: true,
    steps: [
      { id: "s1", kind: "route", title: "Classify question", input: "How many open work orders does Canal Point have?", output: "topics: [work_orders]\nagents: [work orders, database reader]\nreason: asks for a count of open jobs at one building", ms: 371 },
      { id: "s2", kind: "db", title: "SELECT work_orders", agent: "work orders", input: "SELECT id, status FROM work_orders\nWHERE building = 'Canal Point'\n  AND status <> 'Closed'", output: "2 rows\nWO-1047 · Assigned\nWO-1062 · Open", ms: 44 },
      { id: "s3", kind: "db", title: "SELECT work_order_history", agent: "database reader", input: "SELECT id FROM work_order_history\nWHERE building = 'Canal Point'\n  AND closed_at > now() - interval '7 days'", output: "1 row\nWO-1039 · Closed 3 days ago", ms: 39 },
      { id: "s4", kind: "llm", title: "Write combined answer", input: "context: 2 open work orders, 1 recently closed\nquestion: how many open work orders", output: "Canal Point has 3 open work orders: WO-1047, WO-1062 and WO-1039.", ms: 1120 },
      { id: "s5", kind: "answer", title: "Answer", input: "", output: "Canal Point has 3 open work orders: WO-1047, WO-1062 and WO-1039.", ms: 0 },
    ],
  },
  {
    id: "run-0411", question: "Which buildings have certificates expiring this month?", when: "today 10:31", agents: ["compliance", "doc-rag", "database reader"],
    steps: [
      { id: "s1", kind: "route", title: "Classify question", input: "Which buildings have certificates expiring this month?", output: "topics: [compliance, documents]\nagents: [compliance, doc-rag, database reader]", ms: 412 },
      { id: "s2", kind: "db", title: "SELECT certificates", agent: "compliance", input: "SELECT building, type, expires_on FROM certificates\nWHERE expires_on BETWEEN today AND today + 30", output: "3 rows\nCanal Point · Fire alarm inspection\nHarbour House · Legionella risk assessment\nWestpark Offices · Lift inspection", ms: 38 },
      { id: "s3", kind: "doc", title: "Read 3 documents", agent: "doc-rag", input: "hybrid search: certificate expiry dates for 3 documents", output: "CP-FA-2025.pdf p.1 · expiry matches\nHH-LEG-2024.pdf p.2 · expiry matches\nWP-LIFT-Q3.pdf p.1 · expiry matches", ms: 640 },
      { id: "s4", kind: "llm", title: "Write combined answer", input: "context: 3 certificates, 3 confirmed documents", output: "3 certificates expire in the next 30 days. The fire alarm inspection at Canal Point is the most urgent.", ms: 1290 },
      { id: "s5", kind: "answer", title: "Answer", input: "", output: "3 certificates expire in the next 30 days. The fire alarm inspection at Canal Point is the most urgent.", ms: 0 },
    ],
  },
  {
    id: "run-0409", question: "What's the energy use at Riverside Lab compared to benchmark?", when: "today 09:58", agents: ["energy"],
    steps: [
      { id: "s1", kind: "route", title: "Classify question", input: "What's the energy use at Riverside Lab compared to benchmark?", output: "topics: [energy]\nagents: [energy]", ms: 340 },
      { id: "s2", kind: "agent", title: "Pick benchmark", agent: "energy", input: "building type: Laboratory", output: "benchmark: TM46 general office · 215 kWh/m²", ms: 18 },
      { id: "s3", kind: "db", title: "SELECT meter_readings", agent: "energy", input: "SELECT sum(kwh) / area FROM meter_readings ... Riverside Lab, 12 months", output: "402 kWh/m²", ms: 190 },
      { id: "s4", kind: "llm", title: "Write combined answer", input: "context: 402 vs 215", output: "Riverside Lab used 402 kWh/m², 87% above benchmark.", ms: 980 },
      { id: "s5", kind: "answer", title: "Answer", input: "", output: "Riverside Lab used 402 kWh/m², 87% above benchmark.", ms: 0 },
    ],
  },
  {
    id: "run-0405", question: "Which vendors are blocked because their accreditation expired?", when: "yesterday 16:20", agents: ["compliance", "contracts"],
    steps: [
      { id: "s1", kind: "route", title: "Classify question", input: "Which vendors are blocked because their accreditation expired?", output: "topics: [vendor_compliance]\nagents: [compliance, contracts]", ms: 356 },
      { id: "s2", kind: "db", title: "SELECT vendor_accreditations", agent: "compliance", input: "SELECT vendor FROM vendor_accreditations WHERE status = 'expired'", output: "2 rows\nSecureDoors\nVoltCheck", ms: 29 },
      { id: "s3", kind: "llm", title: "Write combined answer", input: "context: 2 vendors", output: "Two vendors are blocked: SecureDoors and VoltCheck.", ms: 960 },
      { id: "s4", kind: "answer", title: "Answer", input: "", output: "Two vendors are blocked: SecureDoors and VoltCheck.", ms: 0 },
    ],
  },
];

type Verdict = "right" | "wrong" | "unsure";
type Label = { id: number; run: string; step: string; stepTitle: string; verdict: Verdict; quote: string; note: string; who: string; mode: string; when: string };

const SEED: Label[] = [
  { id: 1, run: "run-0411", step: "s2", stepTitle: "SELECT certificates", verdict: "right", quote: "", note: "Correct 30-day window.", who: "M. de Vries (domain expert)", mode: "", when: "today 10:35" },
  { id: 2, run: "run-0411", step: "s5", stepTitle: "Answer", verdict: "right", quote: "", note: "", who: "M. de Vries (domain expert)", mode: "", when: "today 10:36" },
  { id: 3, run: "run-0405", step: "s3", stepTitle: "Write combined answer", verdict: "unsure", quote: "Two vendors are blocked", note: "Should it also mention the open jobs at risk?", who: "J. Okafor (tester)", mode: "Incomplete answer", when: "yesterday 16:41" },
];

const MODES = ["Wrong number in answer", "Mixed open and closed data", "Wrong benchmark used", "Incomplete answer", "Wrong agent picked"];
const KIND_ICON: Record<string, string> = { route: "⑂", agent: "◆", llm: "✦", db: "▤", doc: "▧", answer: "✓" };

type View = "runs" | "labels" | "judges";
const NAV: { id: View; label: string; icon: string }[] = [
  { id: "runs", label: "Runs", icon: "≡" },
  { id: "labels", label: "Labels", icon: "✎" },
  { id: "judges", label: "Golden set & judges", icon: "⚖" },
];

export default function TraceLabDemo() {
  const [view, setView] = useState<View>("runs");
  const [labels, setLabels] = useState<Label[]>(SEED);
  const [resetKey, setResetKey] = useState(0);
  const reset = () => { setView("runs"); setLabels(SEED); setResetKey((k) => k + 1); };
  return (
    <div className="d-root" style={{ ["--brand" as string]: "#8fd6a6" }}>
      <DemoBar project="Trace Lab" slug="trace-lab" onReset={reset} />
      <div className="d-mobile-nav">
        {NAV.map((n) => <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>{n.icon} {n.label}</button>)}
      </div>
      <div className="d-app">
        <aside className="d-side">
          <div className="d-logo"><i>T</i>Trace Lab</div>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
              <span aria-hidden="true" style={{ width: 16, textAlign: "center" }}>{n.icon}</span>{n.label}
              {n.id === "labels" && <span className="count">{labels.length}</span>}
            </button>
          ))}
          <div className="d-side-foot">Reading Hoistra runs<br />read-only · sample data<br />You: demo reviewer</div>
        </aside>
        <main className="d-main" key={resetKey}>
          {view === "runs" && <RunsView labels={labels} setLabels={setLabels} />}
          {view === "labels" && <LabelsView labels={labels} />}
          {view === "judges" && <JudgesView />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Runs + labelling ---------------- */

function RunsView({ labels, setLabels }: { labels: Label[]; setLabels: React.Dispatch<React.SetStateAction<Label[]>> }) {
  const [runId, setRunId] = useState(RUNS[0].id);
  const [stepId, setStepId] = useState("s4");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState("");
  const [mode, setMode] = useState("");
  const [saved, setSaved] = useState(false);
  const outRef = useRef<HTMLPreElement>(null);

  const run = RUNS.find((r) => r.id === runId)!;
  const step = run.steps.find((s) => s.id === stepId) ?? run.steps[0];
  const stepLabels = (rid: string, sid: string) => labels.filter((l) => l.run === rid && l.step === sid);

  const grabSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !outRef.current) return;
    if (outRef.current.contains(sel.anchorNode)) setQuote(sel.toString().trim().slice(0, 160));
  };
  const pickStep = (id: string) => { setStepId(id); setVerdict(null); setNote(""); setQuote(""); setMode(""); setSaved(false); };
  const pickRun = (id: string) => { setRunId(id); const r = RUNS.find((x) => x.id === id)!; pickStep(r.steps[r.steps.length - 2].id); };

  const save = () => {
    if (!verdict) return;
    setLabels((ls) => [...ls, {
      id: ls.length + 1, run: run.id, step: step.id, stepTitle: step.title, verdict, quote, note, who: "You (demo reviewer)", mode: verdict === "wrong" ? mode : "",
      when: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setSaved(true);
  };

  const reviewedRuns = new Set(labels.map((l) => l.run)).size;

  return (
    <>
      <div className="d-head">
        <div><h1>Runs</h1><p>Every question asked in Hoistra, with each step its answer was built from. Pick a step and label it.</p></div>
        <div style={{ minWidth: 200 }}>
          <span className="d-note">review progress · {reviewedRuns}/{RUNS.length} runs</span>
          <div className="d-progress" style={{ marginTop: 6 }}><span style={{ width: `${(reviewedRuns / RUNS.length) * 100}%` }} /></div>
        </div>
      </div>
      <div className="d-body t-runs">
        <nav className="t-list" aria-label="Runs">
          {RUNS.map((r) => {
            const n = labels.filter((l) => l.run === r.id).length;
            return (
              <button key={r.id} type="button" className={`t-run ${runId === r.id ? "on" : ""}`} onClick={() => pickRun(r.id)}>
                <span className="mono t-run-id">{r.id} · {r.when}</span>
                <span className="t-run-q">{r.question}</span>
                <span className="t-run-meta">
                  {r.flagged && <span className="d-tag warn">sampled for review</span>}
                  <span className="d-note">{n} label{n === 1 ? "" : "s"}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <section className="t-timeline" aria-label="Timeline">
          <div className="t-q">“{run.question}”</div>
          <ol>
            {run.steps.map((s) => {
              const ls = stepLabels(run.id, s.id);
              const last = ls[ls.length - 1];
              return (
                <li key={s.id}>
                  <button type="button" className={`t-step ${stepId === s.id ? "on" : ""}`} onClick={() => pickStep(s.id)}>
                    <span className="t-icon" aria-hidden="true">{KIND_ICON[s.kind]}</span>
                    <span className="t-step-main">
                      <b>{s.title}</b>
                      <span className="mono">{s.agent ? `${s.agent} · ` : ""}{s.ms ? `${s.ms}ms` : "final"}</span>
                    </span>
                    {last && <span className={`d-tag ${last.verdict === "right" ? "ok" : last.verdict === "wrong" ? "bad" : "warn"}`}>{last.verdict}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="d-card t-detail d-fade" key={run.id + step.id} aria-label="Step detail">
          <div className="t-detail-head"><span className="t-icon">{KIND_ICON[step.kind]}</span><b>{step.title}</b>{step.agent && <span className="d-tag">{step.agent}</span>}</div>
          {step.input && (<><span className="d-note">input</span><pre className="t-pre">{step.input}</pre></>)}
          <span className="d-note">output · select any text to quote it in your label</span>
          <pre className="t-pre out" ref={outRef} onMouseUp={grabSelection} onKeyUp={grabSelection} tabIndex={0}>{step.output}</pre>

          {stepLabels(run.id, step.id).map((l) => (
            <div key={l.id} className="t-label-note">
              <span className={`d-tag ${l.verdict === "right" ? "ok" : l.verdict === "wrong" ? "bad" : "warn"}`}>{l.verdict}</span>
              <span>{l.quote && <q>{l.quote}</q>} {l.note} {l.mode && <em>· {l.mode}</em>}</span>
              <span className="d-note">{l.who}</span>
            </div>
          ))}

          {saved ? (
            <p className="d-note" style={{ color: "#8fd6a6" }}>✓ Label saved. It now shows in Labels and can feed the golden set.</p>
          ) : (
            <div className="t-form">
              <div className="t-verdicts" role="group" aria-label="Verdict">
                {(["right", "wrong", "unsure"] as Verdict[]).map((v) => (
                  <button key={v} type="button" aria-pressed={verdict === v} className={`d-btn small t-v ${v} ${verdict === v ? "on" : ""}`} onClick={() => setVerdict(v)}>
                    {v === "right" ? "✓ Right" : v === "wrong" ? "✕ Wrong" : "? Not sure"}
                  </button>
                ))}
              </div>
              {quote && <div className="t-quote">Quoting: <q>{quote}</q> <button type="button" className="d-btn small ghost" onClick={() => setQuote("")}>clear</button></div>}
              {verdict === "wrong" && (
                <label className="p-field"><span>Failure type</span>
                  <select className="h-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="">Choose…</option>
                    {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
              )}
              <label className="p-field"><span>Note</span>
                <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={run.flagged && step.id === "s4" ? "e.g. counted a closed work order as open" : "Optional"} />
              </label>
              <button type="button" className="d-btn primary" disabled={!verdict} onClick={save}>Save label</button>
            </div>
          )}
          {run.flagged && step.id === "s4" && !saved && <p className="d-note" style={{ margin: 0 }}>Hint: compare this answer with the two database reads above it.</p>}
        </section>
      </div>
    </>
  );
}

/* ---------------- Labels ---------------- */

function LabelsView({ labels }: { labels: Label[] }) {
  const counts = useMemo(() => ({
    right: labels.filter((l) => l.verdict === "right").length,
    wrong: labels.filter((l) => l.verdict === "wrong").length,
    unsure: labels.filter((l) => l.verdict === "unsure").length,
  }), [labels]);

  const exportCsv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = [["run", "step", "verdict", "quote", "note", "failure_type", "reviewer", "time"], ...labels.map((l) => [l.run, l.stepTitle, l.verdict, l.quote, l.note, l.mode, l.who, l.when])];
    const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "trace-lab-labels.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="d-head">
        <div><h1>Labels</h1><p>Every label in one place, with who gave it.</p></div>
        <button type="button" className="d-btn" onClick={exportCsv}>↓ Download CSV</button>
      </div>
      <div className="d-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="d-kpis">
          <div className="d-card d-kpi"><span className="k">right</span><span className="v" style={{ color: "#8fd6a6" }}>{counts.right}</span></div>
          <div className="d-card d-kpi"><span className="k">wrong</span><span className="v" style={{ color: "#ff8f80" }}>{counts.wrong}</span></div>
          <div className="d-card d-kpi"><span className="k">not sure</span><span className="v" style={{ color: "#ffcf7a" }}>{counts.unsure}</span></div>
          <div className="d-card d-kpi"><span className="k">reviewers</span><span className="v">{new Set(labels.map((l) => l.who)).size}</span></div>
        </div>
        <div className="d-table-wrap">
          <table className="d-table">
            <thead><tr><th>Run</th><th>Step</th><th>Verdict</th><th>Quote / note</th><th>Failure type</th><th>Reviewer</th><th>When</th></tr></thead>
            <tbody>
              {[...labels].reverse().map((l) => (
                <tr key={l.id}>
                  <td className="mono">{l.run}</td><td>{l.stepTitle}</td>
                  <td><span className={`d-tag ${l.verdict === "right" ? "ok" : l.verdict === "wrong" ? "bad" : "warn"}`}>{l.verdict}</span></td>
                  <td>{l.quote && <q style={{ color: "var(--text)" }}>{l.quote}</q>} {l.note}</td>
                  <td>{l.mode}</td><td>{l.who}</td><td className="mono" style={{ whiteSpace: "nowrap" }}>{l.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------------- Golden set & judges ---------------- */

const CASES = [
  { q: "Open work orders at Canal Point", v1: false, v2: true },
  { q: "Certificates expiring this month", v1: true, v2: true },
  { q: "Energy at Riverside Lab vs benchmark", v1: false, v2: true },
  { q: "Blocked vendors", v1: true, v2: true },
  { q: "High-priority jobs past SLA", v1: true, v2: true },
  { q: "Lift inspections due this quarter", v1: true, v2: false },
  { q: "Vendor with the best SLA score", v1: true, v2: true },
  { q: "Buildings without a fire risk assessment", v1: false, v2: true },
];

function JudgesView() {
  const [ran, setRan] = useState<0 | 1 | 2>(0);
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState(0);
  const run = (v: 1 | 2) => {
    setBusy(true); setRan(v); setShown(0);
    CASES.forEach((_, i) => window.setTimeout(() => { setShown(i + 1); if (i === CASES.length - 1) setBusy(false); }, 220 * (i + 1)));
  };
  const pass1 = CASES.filter((c) => c.v1).length;
  const pass2 = CASES.filter((c) => c.v2).length;

  return (
    <>
      <div className="d-head">
        <div><h1>Golden set &amp; judges</h1><p>Labelled cases become a golden set. LLM judges, one per failure type, re-check new versions so the same mistake doesn&apos;t come back.</p></div>
      </div>
      <div className="d-body t-judges">
        <section className="d-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <b>Judges</b>
          {[
            { m: "Wrong number in answer", agree: "matches reviewers on 23 of 25 labels" },
            { m: "Mixed open and closed data", agree: "matches reviewers on 18 of 20 labels" },
            { m: "Wrong benchmark used", agree: "matches reviewers on 11 of 12 labels" },
          ].map((j) => (
            <div key={j.m} className="p-chk"><span className="ok">⚖</span><div><b>{j.m}</b><span>{j.agree} · ready</span></div></div>
          ))}
          <p className="d-note" style={{ margin: 0, lineHeight: 1.6 }}>A judge is only switched on once it agrees with human reviewers often enough. Each run shows its cost estimate first.</p>
        </section>
        <section className="d-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <b>Golden set · {CASES.length} cases</b>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button type="button" className="d-btn small" disabled={busy} onClick={() => run(1)}>Run on v1 (before fix)</button>
              <button type="button" className="d-btn small primary" disabled={busy} onClick={() => run(2)}>Run on v2 (after fix)</button>
            </div>
          </div>
          <span className="d-note">estimated cost per run: about $0.04</span>
          <div className="d-table-wrap">
            <table className="d-table" style={{ minWidth: 380 }}>
              <thead><tr><th>Case</th><th>v1</th><th>v2</th></tr></thead>
              <tbody>
                {CASES.map((c, i) => (
                  <tr key={c.q}>
                    <td>{c.q}</td>
                    <td>{(ran === 1 && i < shown) || ran === 2 ? <span className={`d-tag ${c.v1 ? "ok" : "bad"}`}>{c.v1 ? "pass" : "fail"}</span> : <span className="d-note">—</span>}</td>
                    <td>{ran === 2 && i < shown ? <span className={`d-tag ${c.v2 ? "ok" : "bad"}`}>{c.v2 ? "pass" : "fail"}</span> : <span className="d-note">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ran === 2 && !busy && (
            <p className="d-fade" style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              v2 passes <b style={{ color: "#8fd6a6" }}>{pass2}/{CASES.length}</b> vs {pass1}/{CASES.length} for v1. One case got worse (lift inspections), so it goes back to a reviewer before release.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
