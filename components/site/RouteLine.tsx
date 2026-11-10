export function RouteLine() {
  // Dubai lower right, Amsterdam upper left: his path, not a map.
  return (
    <svg viewBox="0 0 420 300" className="h-auto w-full" role="img" aria-label="A line drawn from Dubai to Amsterdam">
      <line x1="0" y1="250" x2="420" y2="250" className="stroke-border" strokeWidth="1" />
      <path d="M352 214 C 300 90, 170 40, 72 78" pathLength={1} fill="none" className="route-path stroke-foreground" strokeWidth="1.25" />
      <circle cx="352" cy="214" r="5" className="route-dot fill-foreground" style={{ animationDelay: "0.2s" }} />
      <circle cx="72" cy="78" r="6" className="route-dot fill-accent" style={{ animationDelay: "2.5s" }} />
      <circle cx="72" cy="78" r="13" fill="none" className="route-dot stroke-accent" strokeWidth="1" style={{ animationDelay: "2.7s" }} />
      <g className="route-label" style={{ animationDelay: "0.3s" }}>
        <text x="352" y="242" textAnchor="middle" className="fill-foreground font-display" fontSize="22">Dubai</text>
        <text x="352" y="268" textAnchor="middle" className="fill-muted-foreground" fontSize="10" letterSpacing="1.5">25.20° N · 55.27° E</text>
      </g>
      <g className="route-label" style={{ animationDelay: "2.6s" }}>
        <text x="72" y="44" textAnchor="middle" className="fill-foreground font-display" fontSize="22">Amsterdam</text>
        <text x="72" y="114" textAnchor="middle" className="fill-muted-foreground" fontSize="10" letterSpacing="1.5">52.37° N · 4.90° E</text>
      </g>
      <text x="0" y="290" className="fill-muted-foreground" fontSize="10" letterSpacing="2">2025 · PLENUM, DUBAI   2026 · UVA, AMSTERDAM</text>
    </svg>
  );
}
