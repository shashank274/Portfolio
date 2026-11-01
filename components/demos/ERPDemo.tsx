"use client";

import { useEffect, useRef, useState } from "react";
import DemoBar from "./DemoBar";
import {
  RECON_STAGES, RULES, bandOf, bank, docs, exceptions, expenses, ledger, matches, riskOf, statusOf,
  type Expense,
} from "./erpData";

type View = "recon" | "policy" | "docs";
const NAV: { id: View; label: string; icon: string }[] = [
  { id: "recon", label: "Bank reconciliation", icon: "⇄" },
  { id: "policy", label: "Policy checks", icon: "⚑" },
  { id: "docs", label: "Document extraction", icon: "▤" },
];

const aed = (n: number) => (n < 0 ? "−" : "") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ERPDemo() {
  const [view, setView] = useState<View>("recon");
  const [resetKey, setResetKey] = useState(0);
  return (
    <div className="d-root" style={{ ["--brand" as string]: "#7db7ff" }}>
      <DemoBar project="ERP-AI suite" slug="erp-ai" onReset={() => { setView("recon"); setResetKey((k) => k + 1); }} />
      <div className="d-mobile-nav">
        {NAV.map((n) => (
          <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>{n.icon} {n.label}</button>
        ))}
      </div>
      <div className="d-app">
        <aside className="d-side">
          <div className="d-logo"><i>E</i>ERP-AI</div>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
              <span aria-hidden="true" style={{ width: 16, textAlign: "center" }}>{n.icon}</span>{n.label}
            </button>
          ))}
          <div className="d-side-foot">Sample company<br />Al Noor Trading LLC · AED<br />Period: October</div>
        </aside>
        <main className="d-main" key={resetKey}>
          {view === "recon" && <ReconView />}
          {view === "policy" && <PolicyView />}
          {view === "docs" && <DocsView />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Reconciliation ---------------- */

function ReconView() {
  const [stage, setStage] = useState(-1); // -1 not run, 0..n running, n = done
  const [status, setStatus] = useState<Record<string, "applied" | "ignored">>({});
  const [open, setOpen] = useState<string | null>("X1");
  const [hover, setHover] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const done = stage >= RECON_STAGES.length;

  const run = () => {
    setStage(0);
    RECON_STAGES.forEach((_, i) => timers.current.push(window.setTimeout(() => setStage(i + 1), 650 * (i + 1))));
  };

  const matchOfBank = (id: string) => matches.find((m) => m.bank === id);
  const matchOfLedger = (id: string) => matches.find((m) => m.ledger.includes(id));
  const kindTag = (k?: string) =>
    !k ? <span className="d-tag bad">unmatched</span>
    : k === "exact" ? <span className="d-tag ok">matched</span>
    : k === "composite" ? <span className="d-tag info">composite</span>
    : <span className="d-tag warn">{k === "timing" ? "timing" : "difference"}</span>;

  const autoMatched = matches.filter((m) => m.kind === "exact" || m.kind === "composite").length;
  const openCount = exceptions.filter((x) => !status[x.id]).length;
  const safeOpen = exceptions.filter((x) => x.safe && !status[x.id]);
  const hl = (bankId?: string, ledgerIds?: string[]) => {
    if (!hover) return false;
    const m = matches.find((x) => x.bank === hover || x.ledger.includes(hover));
    if (!m) return hover === bankId || (ledgerIds ?? []).includes(hover);
    return m.bank === bankId || (ledgerIds ?? []).some((l) => m.ledger.includes(l));
  };

  return (
    <>
      <div className="d-head">
        <div><h1>Bank reconciliation</h1><p>Match the October bank statement to the general ledger, then work through what doesn&apos;t match.</p></div>
        {stage === -1 && <button type="button" className="d-btn primary" onClick={run}>▶ Run reconciliation</button>}
      </div>
      <div className="d-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {stage >= 0 && !done && (
          <div className="d-card e-stages d-fade">
            {RECON_STAGES.map((s, i) => (
              <div key={s} className={`e-stage ${i < stage ? "done" : i === stage ? "run" : ""}`}>
                {i < stage ? <span className="e-ok">✓</span> : i === stage ? <span className="d-spin" /> : <span className="e-dot" />}
                {s}
              </div>
            ))}
          </div>
        )}

        {done && (
          <div className="d-kpis d-fade">
            <div className="d-card d-kpi"><span className="k">bank lines</span><span className="v">{bank.length}</span><span className="s">vs {ledger.length} ledger entries</span></div>
            <div className="d-card d-kpi"><span className="k">matched automatically</span><span className="v" style={{ color: "#8fd6a6" }}>{autoMatched}</span><span className="s">incl. 1 composite (1 → 2)</span></div>
            <div className="d-card d-kpi"><span className="k">open exceptions</span><span className="v" style={{ color: openCount ? "#ffcf7a" : "#8fd6a6" }}>{openCount}</span><span className="s">{safeOpen.length} safe to auto-apply</span></div>
            <div className="d-card d-kpi"><span className="k">open amount</span><span className="v">AED {aed(exceptions.filter((x) => !status[x.id]).reduce((n, x) => n + x.amount, 0))}</span><span className="s">in exceptions not yet closed</span></div>
          </div>
        )}

        {done && (
          <section className="d-card e-exc d-fade">
            <div className="e-exc-head">
              <div><b>Exceptions</b><span className="d-note"> · each has a 48h SLA</span></div>
              <button type="button" className="d-btn small primary" disabled={!safeOpen.length} onClick={() => setStatus((s) => ({ ...s, ...Object.fromEntries(safeOpen.map((x) => [x.id, "applied"])) }))}>
                Auto-apply {safeOpen.length} safe fixes
              </button>
            </div>
            {exceptions.map((x) => (
              <div key={x.id} className={`e-x ${status[x.id] ? "closed" : ""}`}>
                <button type="button" className="e-x-row" aria-expanded={open === x.id} onClick={() => setOpen(open === x.id ? null : x.id)}>
                  <span className="mono e-ref">{x.ref}</span>
                  <span className={`d-tag ${x.reason === "Missing in ledger" ? "bad" : x.reason === "Outstanding cheque" ? "info" : "warn"}`}>{x.reason}</span>
                  <span className="num mono">{x.amount ? `AED ${aed(x.amount)}` : "—"}</span>
                  {status[x.id] ? (
                    <span className={`d-tag ${status[x.id] === "applied" ? "ok" : ""}`}>{status[x.id] === "applied" ? "✓ applied" : "ignored"}</span>
                  ) : (
                    <span className="d-note">{x.safe ? "safe" : "needs review"} · {x.slaHours}h left</span>
                  )}
                </button>
                {open === x.id && (
                  <div className="e-x-body d-fade">
                    <p><b>Why:</b> {x.explanation}</p>
                    <p><b>Suggested fix:</b> {x.fix}</p>
                    {!status[x.id] && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button type="button" className="d-btn small primary" onClick={() => setStatus((s) => ({ ...s, [x.id]: "applied" }))}>Apply fix</button>
                        <button type="button" className="d-btn small ghost" onClick={() => setStatus((s) => ({ ...s, [x.id]: "ignored" }))}>Ignore</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="e-two">
          <div>
            <h2 className="e-h">Bank statement <span className="d-note">bank_statement_oct.xlsx</span></h2>
            <div className="d-table-wrap">
              <table className="d-table" style={{ minWidth: 440 }}>
                <thead><tr><th>Ref</th><th>Date</th><th>Description</th><th className="num">AED</th>{done && <th>Result</th>}</tr></thead>
                <tbody>
                  {bank.map((b) => {
                    const m = matchOfBank(b.id);
                    return (
                      <tr key={b.id} className={`click ${hl(b.id) ? "sel" : ""}`} onMouseEnter={() => done && setHover(b.id)} onMouseLeave={() => setHover(null)}>
                        <td className="mono">{b.id}</td><td style={{ whiteSpace: "nowrap" }}>{b.date}</td><td>{b.desc}</td><td className="num">{aed(b.amount)}</td>
                        {done && <td>{kindTag(m?.kind)}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="e-h">General ledger <span className="d-note">Business Central export</span></h2>
            <div className="d-table-wrap">
              <table className="d-table" style={{ minWidth: 440 }}>
                <thead><tr><th>Ref</th><th>Date</th><th>Description</th><th className="num">AED</th>{done && <th>Matched to</th>}</tr></thead>
                <tbody>
                  {ledger.map((l) => {
                    const m = matchOfLedger(l.id);
                    return (
                      <tr key={l.id} className={`click ${hl(undefined, [l.id]) ? "sel" : ""}`} onMouseEnter={() => done && setHover(l.id)} onMouseLeave={() => setHover(null)}>
                        <td className="mono">{l.id}</td><td style={{ whiteSpace: "nowrap" }}>{l.date}</td><td>{l.desc}</td><td className="num">{aed(l.amount)}</td>
                        {done && <td>{m ? <span className="mono" style={{ fontSize: 12 }}>{m.bank} · {Math.round(m.score * 100)}%</span> : <span className="d-tag bad">unmatched</span>}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {done && <p className="d-note">Hover a row to see what it matched with.</p>}
      </div>
    </>
  );
}

/* ---------------- Policy checks ---------------- */

function PolicyView() {
  const [checked, setChecked] = useState(0);
  const [sel, setSel] = useState<Expense | null>(null);
  const [override, setOverride] = useState<Record<string, boolean>>({});
  const running = checked > 0 && checked < expenses.length;
  useEffect(() => {
    if (running) {
      const t = window.setTimeout(() => setChecked((c) => c + 1), 260);
      return () => clearTimeout(t);
    }
  }, [running, checked]);

  const counts = { PASS: 0, SOFT_BLOCK: 0, HARD_BLOCK: 0 };
  expenses.slice(0, checked).forEach((e) => counts[statusOf(e)]++);

  return (
    <>
      <div className="d-head">
        <div><h1>Policy checks</h1><p>Every expense is checked against the company rulepack before it&apos;s paid.</p></div>
        {checked === 0 && <button type="button" className="d-btn primary" onClick={() => setChecked(1)}>▶ Check {expenses.length} expenses</button>}
      </div>
      <div className="d-body e-policy">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {checked > 0 && (
            <div className="d-kpis">
              <div className="d-card d-kpi"><span className="k">pass</span><span className="v" style={{ color: "#8fd6a6" }}>{counts.PASS}</span></div>
              <div className="d-card d-kpi"><span className="k">soft block</span><span className="v" style={{ color: "#ffcf7a" }}>{counts.SOFT_BLOCK}</span><span className="s">needs approval</span></div>
              <div className="d-card d-kpi"><span className="k">hard block</span><span className="v" style={{ color: "#ff8f80" }}>{counts.HARD_BLOCK}</span><span className="s">cannot be paid</span></div>
            </div>
          )}
          <div className="d-table-wrap">
            <table className="d-table">
              <thead><tr><th>ID</th><th>Employee</th><th>Expense</th><th>Date</th><th className="num">AED</th><th>Status</th><th>Risk</th></tr></thead>
              <tbody>
                {expenses.map((e, i) => {
                  const isChecked = i < checked;
                  const st = statusOf(e);
                  const r = riskOf(e);
                  return (
                    <tr key={e.id} className={`click ${sel?.id === e.id ? "sel" : ""}`} onClick={() => isChecked && setSel(e)} tabIndex={isChecked ? 0 : -1} onKeyDown={(k) => k.key === "Enter" && isChecked && setSel(e)}>
                      <td className="mono">{e.id}</td><td>{e.who}</td><td>{e.desc}<div className="d-note">{e.category}{e.receipt ? "" : " · no receipt"}</div></td><td>{e.date}</td><td className="num">{aed(e.amount)}</td>
                      <td>
                        {!isChecked ? (checked > 0 && i === checked ? <span className="d-spin" /> : <span className="d-note">—</span>)
                          : override[e.id] ? <span className="d-tag ok">OVERRIDDEN</span>
                          : <span className={`d-tag ${st === "PASS" ? "ok" : st === "SOFT_BLOCK" ? "warn" : "bad"}`}>{st}</span>}
                      </td>
                      <td>{isChecked && <span className="e-risk"><span style={{ width: `${Math.min(r, 100)}%`, background: r >= 70 ? "#ff8f80" : r >= 40 ? "#ffcf7a" : "#8fd6a6" }} /><i>{r}</i></span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {checked >= expenses.length && <p className="d-note">Click an expense to see which rules fired.</p>}
        </div>
        <aside className="d-card e-detail">
          {!sel ? (
            <p className="d-note" style={{ lineHeight: 1.7 }}>
              {checked === 0 ? "Run the checks to see each expense scored against the rulepack." : "Select an expense to see the rules that fired and its risk score."}
            </p>
          ) : (
            <div className="d-fade" key={sel.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="d-note">{sel.id} · {sel.who}</span>
              <b style={{ fontSize: 17 }}>{sel.desc}</b>
              <span className="mono" style={{ fontSize: 13 }}>AED {aed(sel.amount)} · {sel.date}</span>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{sel.note}</p>
              <div className="e-rules">
                {sel.rules.length === 0 && <span className="d-tag ok">no rules fired</span>}
                {sel.rules.map((r) => (
                  <div key={r} className="e-rule">
                    <span>{RULES[r].name}{RULES[r].hard && <span className="d-tag bad" style={{ marginLeft: 6 }}>hard</span>}</span>
                    <span className="mono">+{RULES[r].weight}</span>
                  </div>
                ))}
                {sel.rules.length > 0 && (
                  <div className="e-rule total"><span>Risk score ({bandOf(riskOf(sel))})</span><span className="mono">{riskOf(sel)}</span></div>
                )}
              </div>
              {statusOf(sel) === "SOFT_BLOCK" && (
                override[sel.id] ? <span className="d-tag ok">Override recorded in the audit log</span> : (
                  <button type="button" className="d-btn small primary" onClick={() => setOverride((o) => ({ ...o, [sel.id]: true }))}>Approve with override</button>
                )
              )}
              {statusOf(sel) === "HARD_BLOCK" && <span className="d-note">Hard blocks can&apos;t be overridden. The employee has to fix the claim.</span>}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

/* ---------------- Document extraction ---------------- */

function DocsView() {
  const [docId, setDocId] = useState(docs[0].id);
  const [phase, setPhase] = useState<"idle" | "extract" | "verify" | "done">("idle");
  const [n, setN] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const doc = docs.find((d) => d.id === docId)!;

  useEffect(() => {
    if (phase === "extract" && n < doc.fields.length) {
      const t = window.setTimeout(() => setN((x) => x + 1), 280);
      return () => clearTimeout(t);
    }
    if (phase === "extract" && n >= doc.fields.length) {
      const t = window.setTimeout(() => setPhase("verify"), 500);
      return () => clearTimeout(t);
    }
    if (phase === "verify") {
      const t = window.setTimeout(() => setPhase("done"), 1600);
      return () => clearTimeout(t);
    }
  }, [phase, n, doc.fields.length]);

  const pick = (id: string) => { setDocId(id); setPhase("idle"); setN(0); setAccepted(false); };
  const mismatches = doc.fields.filter((f) => !f.ok);

  return (
    <>
      <div className="d-head">
        <div><h1>Document extraction</h1><p>Azure Document Intelligence reads the document. A separate RAG agent then double-checks every field.</p></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {docs.map((d) => <button key={d.id} type="button" className={`d-btn small ${docId === d.id ? "primary" : ""}`} onClick={() => pick(d.id)}>{d.title}</button>)}
        </div>
      </div>
      <div className="d-body e-docs">
        <div className="e-paper" aria-label={`Sample ${doc.type}`}>
          <div className="e-paper-head"><b>{doc.vendor}</b><span>{doc.type.toUpperCase()}</span></div>
          <div className="e-paper-meta">
            {doc.fields.filter((f) => ["number", "date", "due"].includes(f.key)).map((f) => <span key={f.key}>{f.label}: {f.verified}</span>)}
          </div>
          <table>
            <tbody>
              {doc.lines.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}
              <tr className="tot"><td>Total (AED)</td><td>{doc.fields.find((f) => f.key === "total")!.verified}</td></tr>
            </tbody>
          </table>
          {phase === "extract" && <div className="e-scan" />}
        </div>
        <div className="d-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <b>Extracted fields</b>
            {phase === "idle" && <button type="button" className="d-btn small primary" onClick={() => setPhase("extract")}>▶ Extract</button>}
            {phase === "extract" && <span className="d-note" style={{ display: "flex", gap: 6, alignItems: "center" }}><span className="d-spin" /> reading with prebuilt-{doc.type} model</span>}
            {phase === "verify" && <span className="d-note" style={{ display: "flex", gap: 6, alignItems: "center" }}><span className="d-spin" /> RAG agent checking each field</span>}
            {phase === "done" && <span className={`d-tag ${mismatches.length && !accepted ? "warn" : "ok"}`}>{mismatches.length && !accepted ? `${mismatches.length} field needs review` : "verified"}</span>}
          </div>
          <div className="d-table-wrap">
            <table className="d-table" style={{ minWidth: 420 }}>
              <thead><tr><th>Field</th><th>Extracted</th><th>Conf.</th><th>Second check</th></tr></thead>
              <tbody>
                {doc.fields.map((f, i) => (
                  <tr key={f.key} className={phase === "done" && !f.ok && !accepted ? "sel" : ""}>
                    <td>{f.label}</td>
                    <td className="mono">{i < n || phase === "verify" || phase === "done" ? f.extracted : <span className="d-note">…</span>}</td>
                    <td>{(i < n || phase !== "extract") && phase !== "idle" ? <span className={`d-tag ${f.confidence < 0.85 ? "warn" : ""}`}>{Math.round(f.confidence * 100)}%</span> : ""}</td>
                    <td>
                      {phase === "done" ? (f.ok ? <span className="d-tag ok">✓ matches</span> : accepted ? <span className="d-tag ok">✓ corrected to {f.verified}</span> : <span className="d-tag bad">found {f.verified}</span>) : phase === "verify" ? <span className="d-spin" /> : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {phase === "done" && mismatches.length > 0 && !accepted && (
            <div className="e-alert d-fade">
              <p>The OCR read the total as <b>7,857.00</b>, but the RAG agent found <b>7,875.00</b> in the document, which also matches the line items. A person checks the source before anything is posted.</p>
              <button type="button" className="d-btn small primary" onClick={() => setAccepted(true)}>Use 7,875.00 (checked against source)</button>
            </div>
          )}
          {phase === "done" && (mismatches.length === 0 || accepted) && <p className="d-note">✓ Ready to post to Dynamics 365 and run through the policy checks.</p>}
        </div>
      </div>
    </>
  );
}
