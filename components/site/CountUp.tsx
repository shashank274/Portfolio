"use client";

import { useEffect, useState } from "react";
import { useInView } from "./Reveal";

/** Animates the first number inside `value` (e.g. "Top 5%", "95%+") once visible. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = m ? parseFloat(m[2] ?? "0") : 0;
  const [ref, inView] = useInView<HTMLSpanElement>(0.4);
  const [n, setN] = useState(target);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!inView || started || !m) return;
    setStarted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    const t0 = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {m[1]}
        {n}
        {m[3]}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
