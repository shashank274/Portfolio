"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const QUESTION = "Which buildings have certificates expiring this month?";
const AGENTS = ["compliance", "contracts", "energy", "work orders", "doc-rag", "migration", "database reader"];
const PICKED = new Set(["compliance", "doc-rag", "database reader"]);

type AgentState = "idle" | "running" | "done";
type State = {
  typed: number;
  wire1: boolean;
  orch: boolean;
  bus: boolean;
  agents: Record<string, AgentState>;
  wire2: boolean;
  answer: boolean;
};

const idleAgents = () => Object.fromEntries(AGENTS.map((a) => [a, "idle" as AgentState]));
const initial = (): State => ({ typed: 0, wire1: false, orch: false, bus: false, agents: idleAgents(), wire2: false, answer: false });
const finished = (): State => ({
  typed: QUESTION.length,
  wire1: true,
  orch: true,
  bus: true,
  agents: Object.fromEntries(AGENTS.map((a) => [a, PICKED.has(a) ? "done" : "idle"])) as Record<string, AgentState>,
  wire2: true,
  answer: true,
});

export default function TraceDiagram() {
  const [s, setS] = useState<State>(initial);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<number[]>([]);
  const ref = useRef<HTMLElement>(null);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const play = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setS(finished());
      return;
    }
    clear();
    setPlaying(true);
    setS(initial());
    let t = 300;
    for (let i = 1; i <= QUESTION.length; i++) {
      at(t, () => setS((p) => ({ ...p, typed: i })));
      t += 26;
    }
    t += 250;
    at(t, () => setS((p) => ({ ...p, wire1: true })));
    t += 450;
    at(t, () => setS((p) => ({ ...p, orch: true })));
    t += 500;
    at(t, () => setS((p) => ({ ...p, bus: true })));
    t += 450;
    at(t, () =>
      setS((p) => ({
        ...p,
        agents: Object.fromEntries(AGENTS.map((a) => [a, PICKED.has(a) ? "running" : "idle"])) as Record<string, AgentState>,
      })),
    );
    [...PICKED].forEach((a, i) => {
      at(t + 900 + i * 420, () => setS((p) => ({ ...p, agents: { ...p.agents, [a]: "done" } })));
    });
    t += 900 + PICKED.size * 420 + 200;
    at(t, () => setS((p) => ({ ...p, wire2: true })));
    t += 450;
    at(t, () => {
      setS((p) => ({ ...p, answer: true }));
      setPlaying(false);
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [play]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const typing = s.typed < QUESTION.length;

  return (
    <figure className="trace" ref={ref} onMouseMove={onMove} aria-label="Animated example of how Hoistra answers a question">
      <div className="trace-head">
        <span>trace · hoistra</span>
        <span className={`trace-status ${s.answer ? "done" : ""}`}>{s.answer ? "● completed" : "● running"}</span>
      </div>
      <div className="trace-body">
        <span className="t-step">step 1 · question</span>
        <div className="t-q">
          &ldquo;{QUESTION.slice(0, s.typed)}
          {typing ? <span className="caret" /> : "”"}
        </div>
        <div className={`t-wire ${s.wire1 ? "on" : ""}`} />
        <span className="t-step">step 2 · route</span>
        <div className={`t-orch ${s.orch ? "on" : ""}`}>Single Door orchestrator</div>
        <div className={`t-wire ${s.bus ? "on" : ""}`} style={{ height: 22 }} />
        <div className={`t-bus ${s.bus ? "on" : ""}`} />
        <span className="t-step" style={{ paddingTop: 14 }}>
          step 3 · run agents in parallel
        </span>
        <div className="t-agents">
          {AGENTS.map((a) => (
            <span key={a} className={`t-agent ${s.agents[a] === "idle" ? "" : s.agents[a]}`}>
              {a}
              {s.agents[a] === "done" ? " ✓" : ""}
            </span>
          ))}
        </div>
        <div className={`t-wire ${s.wire2 ? "on" : ""}`} style={{ marginTop: 14 }} />
        <span className="t-step">step 4 · answer</span>
        <div className={`t-answer ${s.answer ? "on" : ""}`}>One combined answer, with sources</div>
      </div>
      <figcaption>
        <span>How Hoistra answers a question</span>
        <button type="button" className="replay" onClick={play} disabled={playing}>
          {playing ? "running…" : "↻ replay"}
        </button>
      </figcaption>
    </figure>
  );
}
