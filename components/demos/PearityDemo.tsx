"use client";

import { useEffect, useRef, useState } from "react";
import DemoBar from "./DemoBar";

/* ---------------- sample data (all made up) ---------------- */

type Brand = { id: string; name: string; colors: string[]; tagline: string; font: string; tone: string };
const BRANDS: Brand[] = [
  { id: "lumen", name: "Lumen Coffee", colors: ["#2b1d14", "#c8873a", "#f3e6d3"], tagline: "Brewed slow, served bright", font: "Serif headline, sans body", tone: "Warm, calm, unhurried" },
  { id: "aurora", name: "Aurora Sport", colors: ["#0b1f3a", "#3ee0c5", "#f5f7fa"], tagline: "Move with the light", font: "Bold condensed sans", tone: "Energetic, direct" },
  { id: "sahara", name: "Sahara Scents", colors: ["#3d2418", "#d9a441", "#f8efe2"], tagline: "The desert, bottled", font: "Elegant serif", tone: "Luxurious, sensory" },
];

type Modality = "image" | "video" | "audio";
type Model = { id: string; name: string; modality: Modality; cost: number; vendor: string; note?: string; scenario?: "failover" | "fail" };
const MODELS: Model[] = [
  { id: "nano", name: "Nano Banana", modality: "image", cost: 8, vendor: "Kie" },
  { id: "seedream", name: "Seedream 4", modality: "image", cost: 6, vendor: "Kie" },
  { id: "gptimg", name: "GPT Image", modality: "image", cost: 12, vendor: "OpenAI" },
  { id: "seedance", name: "Seedance 2 · 1080p · 10s", modality: "video", cost: 420, vendor: "Kie", note: "failover", scenario: "failover" },
  { id: "kling", name: "Kling 3 · 5s", modality: "video", cost: 280, vendor: "Kling", note: "fails + refund", scenario: "fail" },
  { id: "tts", name: "ElevenLabs voice-over", modality: "audio", cost: 14, vendor: "ElevenLabs" },
];
const PROMPTS: Record<Modality, string[]> = {
  image: ["Flat lay of a morning coffee ritual on linen, soft window light", "Product hero shot on a sand dune at golden hour"],
  video: ["Slow push-in on steam rising from a cup, warm light", "Runner at dawn on a coastal road, drone shot"],
  audio: ["30-second calm voice-over for a morning coffee ad"],
};

type LogLine = { t: string; text: string; tone?: "ok" | "warn" | "bad" };
type Job = {
  id: number; brand: Brand; model: Model; prompt: string; status: "queued" | "processing" | "completed" | "failed";
  progress: number; vendor: string; log: LogLine[]; refunded?: boolean; check?: number;
};

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

type View = "production" | "brand" | "credits";
const NAV: { id: View; label: string; icon: string }[] = [
  { id: "production", label: "Production", icon: "✦" },
  { id: "brand", label: "Brand check", icon: "◎" },
  { id: "credits", label: "Credits", icon: "◈" },
];

export default function PearityDemo() {
  const [view, setView] = useState<View>("production");
  const [brandId, setBrandId] = useState("lumen");
  const [pools, setPools] = useState<Record<string, number>>({ org: 5000, lumen: 1250, aurora: 600, sahara: 90 });
  const [ledger, setLedger] = useState<LogLine[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const brand = BRANDS.find((b) => b.id === brandId)!;

  const reset = () => {
    setView("production"); setBrandId("lumen"); setPools({ org: 5000, lumen: 1250, aurora: 600, sahara: 90 }); setLedger([]); setResetKey((k) => k + 1);
  };
  const addLedger = (text: string, tone?: LogLine["tone"]) => setLedger((l) => [{ t: now(), text, tone }, ...l].slice(0, 12));

  return (
    <div className="d-root" style={{ ["--brand" as string]: "#d6b25e" }}>
      <DemoBar project="Pearity.ai" slug="pearity" onReset={reset} />
      <div className="d-mobile-nav">
        {NAV.map((n) => <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>{n.icon} {n.label}</button>)}
      </div>
      <div className="d-app">
        <aside className="d-side">
          <div className="d-logo"><i>P</i>Pearity</div>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`d-nav ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
              <span aria-hidden="true" style={{ width: 16, textAlign: "center" }}>{n.icon}</span>{n.label}
            </button>
          ))}
          <div className="d-side-foot">Sample agency<br />3 brand environments<br />1 credit = $0.01</div>
        </aside>
        <main className="d-main" key={resetKey}>
          <div className="p-top">
            <label className="p-brand-pick">
              <span className="d-note">Brand</span>
              <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="h-select">
                {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </label>
            <span className="p-badge" title="Shared credit pool for this brand">◈ {pools[brandId].toLocaleString()} credits</span>
          </div>
          {view === "production" && <Production brand={brand} pools={pools} setPools={setPools} addLedger={addLedger} />}
          {view === "brand" && <BrandCheck brand={brand} />}
          {view === "credits" && <Credits pools={pools} setPools={setPools} ledger={ledger} addLedger={addLedger} />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Production ---------------- */

function Production({ brand, pools, setPools, addLedger }: {
  brand: Brand; pools: Record<string, number>; setPools: React.Dispatch<React.SetStateAction<Record<string, number>>>; addLedger: (t: string, tone?: LogLine["tone"]) => void;
}) {
  const [modality, setModality] = useState<Modality>("image");
  const [modelId, setModelId] = useState("nano");
  const [prompt, setPrompt] = useState(PROMPTS.image[0]);
  const [useBrand, setUseBrand] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const idRef = useRef(1);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const model = MODELS.find((m) => m.id === modelId)!;
  const balance = pools[brand.id];

  const pickModality = (m: Modality) => {
    setModality(m);
    const first = MODELS.find((x) => x.modality === m)!;
    setModelId(first.id);
    setPrompt(PROMPTS[m][0]);
    setError(null);
  };

  const patch = (id: number, fn: (j: Job) => Job) => setJobs((js) => js.map((j) => (j.id === id ? fn(j) : j)));
  const log = (id: number, text: string, tone?: LogLine["tone"]) => patch(id, (j) => ({ ...j, log: [...j.log, { t: now(), text, tone }] }));
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const generate = () => {
    setError(null);
    if (model.cost > balance) {
      setError("Brand environment credits are exhausted. Please reach out to your admin to get more.");
      return;
    }
    const id = idRef.current++;
    setPools((p) => ({ ...p, [brand.id]: p[brand.id] - model.cost }));
    addLedger(`${brand.name}: −${model.cost} for ${model.name}`);
    const job: Job = {
      id, brand, model, prompt, status: "queued", progress: 0, vendor: model.vendor,
      log: [{ t: now(), text: `Job created · charged ${model.cost} credits to ${brand.name}` }],
    };
    setJobs((js) => [job, ...js]);
    setSel(id);

    let t = 500;
    if (model.scenario === "failover") {
      at(t, () => log(id, "Vendor check: Kie needs 4,200, has 1,150 left", "warn")); t += 700;
      at(t, () => { log(id, "Seedance failover → routed to Higgsfield", "ok"); patch(id, (j) => ({ ...j, vendor: "Higgsfield" })); }); t += 500;
    } else {
      at(t, () => log(id, `Vendor check: ${model.vendor} balance OK`)); t += 500;
    }
    if (useBrand) { at(t, () => log(id, `Brand guidelines added to the prompt (${brand.tone.toLowerCase()})`)); t += 400; }
    at(t, () => patch(id, (j) => ({ ...j, status: "processing" })));
    const steps = model.modality === "video" ? 10 : 6;
    for (let i = 1; i <= steps; i++) {
      t += model.modality === "video" ? 380 : 260;
      const pct = Math.round((i / steps) * 100);
      if (model.scenario === "fail" && pct >= 60) {
        at(t, () => {
          log(id, "Kling returned an error: duration must be a string", "bad");
          patch(id, (j) => ({ ...j, status: "failed", progress: 60 }));
        });
        at(t + 500, () => {
          log(id, `Refunded ${model.cost} credits (once per job)`, "ok");
          patch(id, (j) => ({ ...j, refunded: true }));
          setPools((p) => ({ ...p, [brand.id]: p[brand.id] + model.cost }));
          addLedger(`${brand.name}: +${model.cost} refund for failed ${model.name}`, "ok");
        });
        return;
      }
      at(t, () => patch(id, (j) => ({ ...j, progress: pct })));
    }
    t += 300;
    at(t, () => { log(id, "Completed · saved to gallery", "ok"); patch(id, (j) => ({ ...j, status: "completed" })); });
    if (model.modality !== "audio") {
      t += 700;
      const score = useBrand ? 97 : 84;
      at(t, () => { log(id, `Brand check: ${score}% match to ${brand.name} guidelines`, score >= 90 ? "ok" : "warn"); patch(id, (j) => ({ ...j, check: score })); });
    }
  };

  const selected = jobs.find((j) => j.id === sel);

  return (
    <>
      <div className="d-head"><div><h1>Production</h1><p>Generate images, video and audio for {brand.name}. Every job spends from the brand&apos;s credit pool.</p></div></div>
      <div className="d-body p-prod">
        <section className="d-card p-composer" aria-label="Composer">
          <div className="p-modes" role="tablist">
            {(["image", "video", "audio"] as Modality[]).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={modality === m} className={`p-mode ${modality === m ? "on" : ""}`} onClick={() => pickModality(m)}>{m}</button>
            ))}
          </div>
          <label className="p-field">
            <span>Model</span>
            <select className="h-select" value={modelId} onChange={(e) => { setModelId(e.target.value); setError(null); }}>
              {MODELS.filter((m) => m.modality === modality).map((m) => (
                <option key={m.id} value={m.id}>{m.name} · {m.cost} cr{m.note ? ` (${m.note})` : ""}</option>
              ))}
            </select>
          </label>
          <label className="p-field">
            <span>Prompt</span>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
          </label>
          <div className="p-suggest">
            {PROMPTS[modality].map((p) => <button key={p} type="button" className="h-chip" onClick={() => setPrompt(p)}>{p}</button>)}
          </div>
          <label className="h-check" style={{ fontSize: 13 }}>
            <input type="checkbox" checked={useBrand} onChange={(e) => setUseBrand(e.target.checked)} />
            Use {brand.name} brand guidelines
          </label>
          <button type="button" className="d-btn primary" onClick={generate} disabled={!prompt.trim()}>
            Generate · {model.cost} credits
          </button>
          {error && <p className="p-error d-fade" role="alert">402 · {error}</p>}
          <p className="d-note" style={{ margin: 0, lineHeight: 1.6 }}>
            Tip: try Seedance to see provider failover, Kling to see a failed job get refunded, or switch to Sahara Scents (90 credits) and try a video.
          </p>
        </section>

        <section className="p-gallery" aria-label="Gallery">
          {jobs.length === 0 ? (
            <div className="d-card d-empty">Your generations will appear here.</div>
          ) : (
            <div className="p-grid">
              {jobs.map((j) => (
                <button key={j.id} type="button" className={`p-job d-fade ${sel === j.id ? "on" : ""}`} onClick={() => setSel(j.id)}>
                  <Preview job={j} />
                  <div className="p-job-meta">
                    <span>{j.model.name}</span>
                    <span className={`d-tag ${j.status === "completed" ? "ok" : j.status === "failed" ? "bad" : "info"}`}>{j.status}{j.refunded ? " · refunded" : ""}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div className="d-card p-log d-fade" key={selected.id}>
              <div className="p-log-head">
                <b>Job #{selected.id}</b>
                <span className="d-note">{selected.brand.name} · {selected.model.name} · vendor: {selected.vendor}</span>
              </div>
              <ol>
                {selected.log.map((l, i) => (
                  <li key={i} className={l.tone ?? ""}><span className="mono">{l.t}</span>{l.text}</li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Preview({ job }: { job: Job }) {
  const [c0, c1, c2] = job.brand.colors;
  if (job.status === "queued" || job.status === "processing") {
    return (
      <div className="p-prev loading">
        <span className="d-spin" />
        <span className="mono">{job.status === "queued" ? "queued" : `${job.progress}%`}</span>
        <div className="d-progress" style={{ width: "70%" }}><span style={{ width: `${job.progress}%` }} /></div>
      </div>
    );
  }
  if (job.status === "failed") return <div className="p-prev failed"><span>✕</span><span className="mono">generation failed</span></div>;
  if (job.model.modality === "audio") {
    return (
      <div className="p-prev" style={{ background: c0 }}>
        <div className="p-wave">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ height: `${20 + ((i * 37) % 60)}%`, background: c1 }} />)}</div>
        <span className="p-dur">0:30</span>
      </div>
    );
  }
  return (
    <div className="p-prev art" style={{ background: `radial-gradient(circle at 30% 30%, ${c1}, transparent 55%), linear-gradient(135deg, ${c0}, ${c0} 40%, ${c1})` }}>
      <span className="p-art-name" style={{ color: c2 }}>{job.brand.name}</span>
      <span className="p-art-tag" style={{ color: c2 }}>{job.brand.tagline}</span>
      {job.model.modality === "video" && <span className="p-play" aria-hidden="true">▶</span>}
      {job.model.modality === "video" && <span className="p-dur">{job.model.name.includes("10s") ? "0:10" : "0:05"}</span>}
      {job.check && <span className="p-check">◎ {job.check}%</span>}
    </div>
  );
}

/* ---------------- Brand check ---------------- */

function BrandCheck({ brand }: { brand: Brand }) {
  const [asset, setAsset] = useState<0 | 1>(0);
  const [ran, setRan] = useState(false);
  const [busy, setBusy] = useState(false);
  const typo = brand.name.replace(/(\w)(\w)(\w+)$/, (_, a, b, c) => `${a}${c}`);
  const checks = asset === 0
    ? [
        { label: "Colours within the brand palette", ok: true, detail: "3 of 3 main colours matched" },
        { label: "Logo text found (OCR)", ok: true, detail: `read "${brand.name.toUpperCase()}"` },
        { label: "Tagline spelled correctly", ok: true, detail: `"${brand.tagline}"` },
        { label: "No banned words", ok: true, detail: "0 found" },
      ]
    : [
        { label: "Colours within the brand palette", ok: true, detail: "3 of 3 main colours matched" },
        { label: "Logo text found (OCR)", ok: false, detail: `read "${typo.toUpperCase()}" · expected "${brand.name.toUpperCase()}"` },
        { label: "Tagline spelled correctly", ok: true, detail: `"${brand.tagline}"` },
        { label: "No banned words", ok: true, detail: "0 found" },
      ];
  const score = asset === 0 ? 98 : 74;
  const run = () => { setBusy(true); setRan(false); window.setTimeout(() => { setBusy(false); setRan(true); }, 1400); };
  const [c0, c1, c2] = brand.colors;

  return (
    <>
      <div className="d-head"><div><h1>Brand check</h1><p>Before work goes to the client, it&apos;s checked against the brand profile, including OCR on any text in the image.</p></div></div>
      <div className="d-body p-brand">
        <section className="d-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <b>{brand.name} brand profile</b>
          <div className="p-swatches">{brand.colors.map((c) => <span key={c} style={{ background: c }} title={c} />)}</div>
          <dl className="p-dl">
            <dt>Tagline</dt><dd>{brand.tagline}</dd>
            <dt>Type</dt><dd>{brand.font}</dd>
            <dt>Tone</dt><dd>{brand.tone}</dd>
          </dl>
          <span className="d-note">Built from uploaded brand images and guidelines</span>
        </section>
        <section style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[0, 1].map((i) => (
              <button key={i} type="button" className={`d-btn small ${asset === i ? "primary" : ""}`} onClick={() => { setAsset(i as 0 | 1); setRan(false); }}>
                {i === 0 ? "Asset A · social post" : "Asset B · banner"}
              </button>
            ))}
            <button type="button" className="d-btn small" onClick={run} disabled={busy}>{busy ? <><span className="d-spin" /> checking…</> : "▶ Run brand check"}</button>
          </div>
          <div className="p-check-grid">
            <div className="p-prev art big" style={{ background: `radial-gradient(circle at 70% 30%, ${c1}, transparent 55%), linear-gradient(160deg, ${c0}, ${c1})` }}>
              <span className="p-art-name" style={{ color: c2, fontSize: 30 }}>{asset === 0 ? brand.name : typo}</span>
              <span className="p-art-tag" style={{ color: c2 }}>{brand.tagline}</span>
              {busy && <div className="e-scan" />}
            </div>
            <div className="d-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {!ran ? (
                <p className="d-note" style={{ margin: 0, lineHeight: 1.6 }}>Pick an asset and run the check.</p>
              ) : (
                <div className="d-fade" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <b>Brand match</b>
                    <span style={{ fontSize: 28, fontWeight: 800, color: score >= 90 ? "#8fd6a6" : "#ffcf7a" }}>{score}%</span>
                  </div>
                  {checks.map((c) => (
                    <div key={c.label} className="p-chk">
                      <span className={c.ok ? "ok" : "bad"}>{c.ok ? "✓" : "✕"}</span>
                      <div><b>{c.label}</b><span>{c.detail}</span></div>
                    </div>
                  ))}
                  {score < 90 && <p className="p-error" style={{ margin: 0 }}>Logo is misspelled. Sent back to the designer before it reaches the client.</p>}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------------- Credits ---------------- */

function Credits({ pools, setPools, ledger, addLedger }: {
  pools: Record<string, number>; setPools: React.Dispatch<React.SetStateAction<Record<string, number>>>; ledger: LogLine[]; addLedger: (t: string, tone?: LogLine["tone"]) => void;
}) {
  const [amount, setAmount] = useState(250);
  const move = (brand: Brand, dir: "fund" | "defund") => {
    if (dir === "fund") {
      if (pools.org < amount) return;
      setPools((p) => ({ ...p, org: p.org - amount, [brand.id]: p[brand.id] + amount }));
      addLedger(`Funded ${brand.name} +${amount} from organisation pool`, "ok");
    } else {
      const amt = Math.min(amount, pools[brand.id]);
      if (!amt) return;
      setPools((p) => ({ ...p, org: p.org + amt, [brand.id]: p[brand.id] - amt }));
      addLedger(`Defunded ${brand.name} −${amt} back to organisation pool`);
    }
  };
  return (
    <>
      <div className="d-head"><div><h1>Credits</h1><p>The agency tops up one organisation pool, then admins fund each brand. Generations spend from the brand pool.</p></div></div>
      <div className="d-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="d-card d-kpi" style={{ maxWidth: 320 }}>
          <span className="k">organisation pool</span><span className="v">{pools.org.toLocaleString()}</span><span className="s">unallocated credits</span>
        </div>
        <div className="p-amount">
          <span className="d-note">Amount</span>
          {[100, 250, 500, 1000].map((a) => <button key={a} type="button" className={`d-btn small ${amount === a ? "primary" : ""}`} onClick={() => setAmount(a)}>{a}</button>)}
        </div>
        <div className="d-kpis">
          {BRANDS.map((b) => (
            <div key={b.id} className="d-card d-kpi">
              <span className="k">{b.name}</span>
              <span className="v">{pools[b.id].toLocaleString()}</span>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <button type="button" className="d-btn small primary" onClick={() => move(b, "fund")} disabled={pools.org < amount}>Fund +{amount}</button>
                <button type="button" className="d-btn small" onClick={() => move(b, "defund")} disabled={pools[b.id] === 0}>Defund</button>
              </div>
            </div>
          ))}
        </div>
        <div className="d-card p-log">
          <div className="p-log-head"><b>Credit ledger</b><span className="d-note">this session</span></div>
          {ledger.length === 0 ? <p className="d-note" style={{ margin: 0 }}>Fund a brand or generate something to see entries here.</p> : (
            <ol>{ledger.map((l, i) => <li key={i} className={l.tone ?? ""}><span className="mono">{l.t}</span>{l.text}</li>)}</ol>
          )}
        </div>
      </div>
    </>
  );
}
