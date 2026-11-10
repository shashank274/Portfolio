"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DemoBar from "./DemoBar";
import {
  AGENTS, buildings, certificates, day, energy, legacyColumns, matchScript, scripts, targetFields, vendors, workOrders,
  type Script,
} from "./hoistraData";

type View = "ask" | "compliance" | "workorders" | "energy" | "migration";
type Msg =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; script: Script | null; step: number; done: boolean };

const NAV: { id: View; label: string; icon: string }[] = [
  { id: "ask", label: "Ask Hoistra", icon: "◆" },
  { id: "compliance", label: "Compliance", icon: "✓" },
  { id: "workorders", label: "Work orders", icon: "⚒" },
  { id: "energy", label: "Energy", icon: "ϟ" },
  { id: "migration", label: "Data migration", icon: "⇄" },
];

const KIND_ICON: Record<string, string> = { route: "⑂", agent: "◆", llm: "✦", db: "▤", doc: "▧", answer: "✓" };

export default function HoistraDemo() {
  const [view, setView] = useState<View>("ask");
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="d-root" style={{ ["--brand" as string]: "#ffb547" }}>
      <DemoBar project="Hoistra" slug="hoistra" onReset={() => { setView("ask"); setResetKey((k) => k + 1); }} />
      <div className="d-mobile-nav">
        {NAV.map((n) => (
          <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>
      <div className="d-app">
        <aside className="d-side">
          <div className="d-logo"><i>H</i>Hoistra</div>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
              <span aria-hidden="true" style={{ width: 16, textAlign: "center" }}>{n.icon}</span>
              {n.label}
              {n.id === "compliance" && <span className="count">{certificates.filter((c) => c.expires <= 30).length}</span>}
              {n.id === "workorders" && <span className="count">{workOrders.length}</span>}
            </button>
          ))}
          <div className="d-side-foot">
            Sample portfolio
            <br />
            {buildings.length} buildings · {buildings.reduce((n, b) => n + b.assets, 0)} assets
          </div>
        </aside>
        <main className="d-main" key={resetKey}>
          {view === "ask" && <AskView />}
          {view === "compliance" && <ComplianceView />}
          {view === "workorders" && <WorkOrdersView />}
          {view === "energy" && <EnergyView />}
          {view === "migration" && <MigrationView />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Ask ---------------- */

function AskView() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const ask = (text: string, forced?: Script) => {
    if (busy || !text.trim()) return;
    const script = forced ?? matchScript(text);
    const uid = idRef.current++;
    const aid = idRef.current++;
    setMsgs((m) => [...m, { id: uid, role: "user", text }, { id: aid, role: "assistant", script, step: script ? 0 : -1, done: !script }]);
    setInput("");
    setActive(aid);
    if (!script) return;
    setBusy(true);
    let t = 0;
    script.steps.forEach((s, i) => {
      t += Math.min(Math.max(s.ms, 350), 1100);
      timers.current.push(
        window.setTimeout(() => {
          setMsgs((m) => m.map((x) => (x.id === aid && x.role === "assistant" ? { ...x, step: i + 1, done: i + 1 === script.steps.length } : x)));
          if (i + 1 === script.steps.length) setBusy(false);
        }, t),
      );
    });
  };

  const activeMsg = msgs.find((m) => m.id === active && m.role === "assistant") as Extract<Msg, { role: "assistant" }> | undefined;

  return (
    <>
      <div className="d-head">
        <div>
          <h1>Ask Hoistra</h1>
          <p>Ask about your buildings in plain English. One orchestrator routes it to the right agents.</p>
        </div>
      </div>
      <div className="h-ask">
        <section className="h-chat" aria-label="Conversation">
          <div className="h-msgs">
            {msgs.length === 0 && (
              <div className="h-welcome d-fade">
                <div className="h-orb" aria-hidden="true">◆</div>
                <h2>What do you want to know?</h2>
                <p>Try one of these sample questions:</p>
                <div className="h-suggest">
                  {scripts.map((s) => (
                    <button key={s.id} type="button" className="h-chip" onClick={() => ask(s.q, s)}>
                      {s.q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="h-user d-fade">{m.text}</div>
              ) : (
                <AssistantMsg key={m.id} m={m} onPick={(s) => ask(s.q, s)} onFocus={() => setActive(m.id)} focused={active === m.id} />
              ),
            )}
            <div ref={endRef} />
          </div>
          {msgs.length > 0 && !busy && (
            <div className="h-suggest small">
              {scripts.map((s) => (
                <button key={s.id} type="button" className="h-chip" onClick={() => ask(s.q, s)}>
                  {s.q}
                </button>
              ))}
            </div>
          )}
          <form
            className="h-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label htmlFor="h-q" className="sr-only">Your question</label>
            <input id="h-q" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about certificates, energy, work orders or vendors…" disabled={busy} />
            <button type="submit" className="d-btn primary" disabled={busy || !input.trim()}>
              {busy ? <span className="d-spin" /> : "Ask"}
            </button>
          </form>
        </section>
        <TracePanel m={activeMsg} />
      </div>
    </>
  );
}

function AssistantMsg({ m, onPick, onFocus, focused }: { m: Extract<Msg, { role: "assistant" }>; onPick: (s: Script) => void; onFocus: () => void; focused: boolean }) {
  if (!m.script) {
    return (
      <div className="h-bot d-fade">
        <p>This demo runs on sample data, so it can only answer a few questions. Try one of these:</p>
        <div className="h-suggest small">
          {scripts.map((s) => (
            <button key={s.id} type="button" className="h-chip" onClick={() => onPick(s)}>
              {s.q}
            </button>
          ))}
        </div>
      </div>
    );
  }
  const s = m.script;
  const routed = m.step >= 1;
  const doneAgents = new Set(s.steps.slice(0, m.step).filter((x) => x.agent).map((x) => x.agent));
  const runningAgent = !m.done ? s.steps[m.step]?.agent : undefined;
  const ans = m.done ? s.answer() : null;

  return (
    <div className={`h-bot d-fade ${focused ? "focused" : ""}`} onClick={onFocus}>
      <div className="h-route">
        <span className={`h-orch ${routed ? "on" : ""}`}>{routed ? "◆ Orchestrator" : <><span className="d-spin" /> Routing…</>}</span>
        <div className="h-agents">
          {AGENTS.map((a) => {
            const picked = s.agents.includes(a);
            const cls = !routed || !picked ? "" : doneAgents.has(a) && runningAgent !== a ? "done" : runningAgent === a ? "running" : "queued";
            return (
              <span key={a} className={`h-agent ${picked && routed ? "picked" : ""} ${cls}`}>
                {a}
                {cls === "done" ? " ✓" : ""}
              </span>
            );
          })}
        </div>
      </div>
      {!m.done && (
        <p className="h-status"><span className="d-spin" /> {s.steps[Math.max(0, m.step)]?.label ?? "Working"}…</p>
      )}
      {ans && (
        <div className="d-fade">
          <p className="h-answer">{ans.text}</p>
          <div className="d-table-wrap">
            <table className="d-table">
              <thead><tr>{ans.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>{ans.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          {ans.footer && <p className="h-foot">{ans.footer}</p>}
          <div className="h-sources">
            <span className="d-note">sources</span>
            {ans.sources.map((x) => <span key={x} className="d-tag">{x}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function TracePanel({ m }: { m?: Extract<Msg, { role: "assistant" }> }) {
  const s = m?.script;
  const total = s ? s.steps.slice(0, m!.step).reduce((n, x) => n + x.ms, 0) : 0;
  return (
    <aside className="h-trace" aria-label="Run trace">
      <div className="h-trace-head">
        <span>run trace</span>
        {s && <span className={m!.done ? "ok" : ""}>{m!.done ? "● completed" : "● running"}</span>}
      </div>
      {!s ? (
        <p className="d-note" style={{ padding: "8px 2px", lineHeight: 1.6 }}>
          Every answer is traced step by step: which agents ran, each model call and each database read. Ask a question to see it.
        </p>
      ) : (
        <>
          <ol className="h-steps">
            {s.steps.map((st, i) => {
              const state = i < m!.step ? "done" : i === m!.step && !m!.done ? "run" : "wait";
              return (
                <li key={i} className={`h-step ${state}`}>
                  <span className="h-step-icon" aria-hidden="true">{state === "run" ? <span className="d-spin" /> : KIND_ICON[st.kind]}</span>
                  <div>
                    <b>{st.label}</b>
                    <span>{st.detail}</span>
                  </div>
                  <span className="h-ms">{state === "done" && st.ms ? `${st.ms}ms` : ""}</span>
                </li>
              );
            })}
          </ol>
          <div className="h-trace-foot">
            <span>total {(total / 1000).toFixed(2)}s</span>
            {m!.done && <Link href="/demos/trace-lab">Review in Trace Lab →</Link>}
          </div>
        </>
      )}
    </aside>
  );
}

/* ---------------- Simple pages ---------------- */

function ComplianceView() {
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const rows = [...certificates].sort((a, b) => a.expires - b.expires);
  const expired = rows.filter((c) => c.expires < 0).length;
  const soon = rows.filter((c) => c.expires >= 0 && c.expires <= 30).length;
  return (
    <>
      <div className="d-head"><div><h1>Compliance</h1><p>Certificates across all buildings, checked against the Netherlands country pack.</p></div></div>
      <div className="d-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="d-kpis">
          <div className="d-card d-kpi"><span className="k">expired</span><span className="v" style={{ color: "#ff8f80" }}>{expired}</span><span className="s">needs action now</span></div>
          <div className="d-card d-kpi"><span className="k">due in 30 days</span><span className="v" style={{ color: "#ffcf7a" }}>{soon}</span><span className="s">renewals to book</span></div>
          <div className="d-card d-kpi"><span className="k">blocked vendors</span><span className="v">{vendors.filter((v) => v.blocked).length}</span><span className="s">expired accreditation</span></div>
          <div className="d-card d-kpi"><span className="k">coverage</span><span className="v">92%</span><span className="s">required certificates on file (sample)</span></div>
        </div>
        <div className="d-table-wrap">
          <table className="d-table">
            <thead><tr><th>Building</th><th>Certificate</th><th>Vendor</th><th>Expires</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((c) => {
                const key = c.building + c.type;
                return (
                  <tr key={key}>
                    <td>{c.building}</td><td>{c.type}</td><td>{c.vendor}</td><td className="num">{day(c.expires)}</td>
                    <td>{c.expires < 0 ? <span className="d-tag bad">expired</span> : c.expires <= 30 ? <span className="d-tag warn">due soon</span> : <span className="d-tag ok">valid</span>}</td>
                    <td>
                      {c.expires <= 30 && (
                        <button type="button" className="d-btn small" disabled={sent[key]} onClick={() => setSent((s) => ({ ...s, [key]: true }))}>
                          {sent[key] ? "Renewal sent ✓" : "Send renewal"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function WorkOrdersView() {
  const [approved, setApproved] = useState(false);
  return (
    <>
      <div className="d-head"><div><h1>Work orders</h1><p>Open jobs, their SLA clock and the vendor on each one.</p></div></div>
      <div className="d-body">
        <div className="d-table-wrap">
          <table className="d-table">
            <thead><tr><th>ID</th><th>Building</th><th>Issue</th><th>Priority</th><th>Vendor</th><th>Status</th><th>SLA</th></tr></thead>
            <tbody>
              {workOrders.map((w) => (
                <tr key={w.id}>
                  <td className="mono">{w.id}</td><td>{w.building}</td><td>{w.issue}</td>
                  <td><span className={`d-tag ${w.priority === "High" ? "bad" : w.priority === "Medium" ? "warn" : ""}`}>{w.priority}</span></td>
                  <td>{w.vendor}{vendors.find((v) => v.name === w.vendor)?.blocked && <span className="d-tag bad" style={{ marginLeft: 6 }}>blocked</span>}</td>
                  <td>
                    {w.status === "Waiting approval" ? (
                      approved ? <span className="d-tag ok">Approved ✓</span> : (
                        <button type="button" className="d-btn small primary" onClick={() => setApproved(true)}>Approve</button>
                      )
                    ) : w.status}
                  </td>
                  <td className="num" style={{ color: w.slaHours < 0 ? "#ff8f80" : undefined }}>{w.slaHours < 0 ? `breached ${-w.slaHours}h ago` : `${w.slaHours}h left`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="d-note" style={{ marginTop: 14 }}>In the real product, approvals can also be done by replying to an email.</p>
      </div>
    </>
  );
}

function EnergyView() {
  const max = Math.max(...energy.map((e) => Math.max(e.eui, e.benchmark)));
  return (
    <>
      <div className="d-head"><div><h1>Energy</h1><p>Energy use per m² over the last 12 months, compared with CIBSE TM46 benchmarks.</p></div></div>
      <div className="d-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {energy.map((e) => {
          const over = e.eui > e.benchmark;
          return (
            <div key={e.building} className="d-card h-energy">
              <div className="h-energy-top">
                <b>{e.building}</b>
                <span className={`d-tag ${over ? "warn" : "ok"}`}>{over ? `+${Math.round(((e.eui - e.benchmark) / e.benchmark) * 100)}% vs benchmark` : "within benchmark"}</span>
              </div>
              <div className="h-bar" role="img" aria-label={`${e.eui} kWh per m², benchmark ${e.benchmark}`}>
                <span style={{ width: `${(e.eui / max) * 100}%`, background: over ? "#ffb547" : "#8fd6a6" }} />
                <i style={{ left: `${(e.benchmark / max) * 100}%` }} />
              </div>
              <div className="h-energy-foot"><span className="mono">{e.eui} kWh/m² · benchmark {e.benchmark}</span><span>{e.note}</span></div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Migration with human approval gates ---------------- */

const GATES = ["Profile the file", "Check the hierarchy", "Review field mapping", "Final approval"];

function MigrationView() {
  const [gate, setGate] = useState(0);
  const [mapping, setMapping] = useState(() => Object.fromEntries(legacyColumns.map((c) => [c.source, c.target])));
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [importing, setImporting] = useState(0);
  const low = legacyColumns.filter((c) => c.confidence < 0.7);
  const allReviewed = low.every((c) => reviewed[c.source]);

  useEffect(() => {
    if (importing > 0 && importing < 100) {
      const t = window.setTimeout(() => setImporting((p) => Math.min(100, p + 9)), 120);
      return () => clearTimeout(t);
    }
  }, [importing]);

  return (
    <>
      <div className="d-head">
        <div><h1>Data migration</h1><p>Moving a customer&apos;s old maintenance system into Hoistra. A person approves each step before anything changes.</p></div>
        <span className="d-tag info">legacy_cmms_assets.csv · 248 rows</span>
      </div>
      <div className="d-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <ol className="h-gates">
          {GATES.map((g, i) => (
            <li key={g} className={i < gate || importing === 100 ? "done" : i === gate ? "on" : ""}>
              <span>{i < gate || importing === 100 ? "✓" : i + 1}</span>
              {g}
            </li>
          ))}
        </ol>

        {gate === 0 && (
          <div className="d-card h-gate d-fade">
            <h3>Gate 1 · The AI profiled the file</h3>
            <ul>
              <li>8 columns found, 248 rows</li>
              <li>Date format detected as day/month/year</li>
              <li>12 rows have no criticality value, and will be set to &quot;unknown&quot;</li>
              <li>No duplicate asset numbers</li>
            </ul>
            <div className="h-gate-actions"><button type="button" className="d-btn primary" onClick={() => setGate(1)}>Approve and continue</button></div>
          </div>
        )}

        {gate === 1 && (
          <div className="d-card h-gate d-fade">
            <h3>Gate 2 · Location hierarchy</h3>
            <p>The location column was split into site → building → area. Please check the tree looks right.</p>
            <pre className="h-tree">{`Amsterdam
├─ Harbour House        86 assets
│  ├─ Roof / Plant      12
│  └─ Floors 0–7        74
└─ Westpark Offices     29 assets
Rotterdam
├─ Canal Point          64 assets
└─ Dockside Depot       18 assets
Utrecht
└─ Riverside Lab        51 assets`}</pre>
            <div className="h-gate-actions">
              <button type="button" className="d-btn ghost" onClick={() => setGate(0)}>Back</button>
              <button type="button" className="d-btn primary" onClick={() => setGate(2)}>Approve and continue</button>
            </div>
          </div>
        )}

        {gate === 2 && (
          <div className="d-card h-gate d-fade">
            <h3>Gate 3 · Field mapping</h3>
            <p>The AI mapped each old column to a Hoistra field. {low.length} mappings have low confidence, so please confirm or change them.</p>
            <div className="d-table-wrap">
              <table className="d-table">
                <thead><tr><th>Old column</th><th>Example value</th><th>Hoistra field</th><th>Confidence</th><th></th></tr></thead>
                <tbody>
                  {legacyColumns.map((c) => {
                    const isLow = c.confidence < 0.7;
                    return (
                      <tr key={c.source} className={isLow && !reviewed[c.source] ? "sel" : ""}>
                        <td className="mono">{c.source}</td>
                        <td>{c.sample}</td>
                        <td>
                          <label className="sr-only" htmlFor={`map-${c.source}`}>Hoistra field for {c.source}</label>
                          <select id={`map-${c.source}`} className="h-select" value={mapping[c.source]} onChange={(e) => setMapping((m) => ({ ...m, [c.source]: e.target.value }))}>
                            {targetFields.map((f) => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </td>
                        <td><span className={`d-tag ${isLow ? "warn" : "ok"}`}>{Math.round(c.confidence * 100)}%</span></td>
                        <td>
                          {isLow && (
                            <label className="h-check">
                              <input type="checkbox" checked={!!reviewed[c.source]} onChange={(e) => setReviewed((r) => ({ ...r, [c.source]: e.target.checked }))} />
                              reviewed
                            </label>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="h-gate-actions">
              <button type="button" className="d-btn ghost" onClick={() => setGate(1)}>Back</button>
              <button type="button" className="d-btn primary" disabled={!allReviewed} onClick={() => setGate(3)}>
                {allReviewed ? "Approve and continue" : `Review ${low.filter((c) => !reviewed[c.source]).length} more`}
              </button>
            </div>
          </div>
        )}

        {gate === 3 && (
          <div className="d-card h-gate d-fade">
            <h3>Gate 4 · Final approval</h3>
            <div className="d-kpis">
              <div className="d-kpi"><span className="k">assets</span><span className="v">248</span></div>
              <div className="d-kpi"><span className="k">buildings</span><span className="v">5</span></div>
              <div className="d-kpi"><span className="k">fields mapped</span><span className="v">{Object.values(mapping).filter((v) => v !== "(skip column)").length}/8</span></div>
              <div className="d-kpi"><span className="k">errors</span><span className="v" style={{ color: "#8fd6a6" }}>0</span></div>
            </div>
            {importing === 0 ? (
              <div className="h-gate-actions">
                <button type="button" className="d-btn ghost" onClick={() => setGate(2)}>Back</button>
                <button type="button" className="d-btn primary" onClick={() => setImporting(1)}>Approve and import</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                <div className="d-progress"><span style={{ width: `${importing}%` }} /></div>
                <span className="d-note">
                  {importing < 100 ? `Importing… ${Math.round((importing / 100) * 248)} / 248 assets` : "✓ Imported 248 assets. QR codes generated. Every step is saved in the audit log."}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
