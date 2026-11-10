export function Diagram({ rows }: { rows: string[][] }) {
  return (
    <figure aria-label="Architecture diagram" className="border border-border bg-paper-2/60 p-4 md:p-8">
      <ol className="flex flex-col items-stretch">
        {rows.map((row, i) => (
          <li key={i} className="flex flex-col items-center">
            {i > 0 && <span aria-hidden className="block h-7 w-px bg-foreground/60" />}
            <div className="relative flex w-full flex-wrap justify-center gap-2">
              {row.map((b) => (
                <span
                  key={b}
                  className={
                    i === 1
                      ? "border border-accent bg-background px-3 py-2 text-sm font-medium text-foreground"
                      : "border border-foreground/70 bg-background px-3 py-2 text-sm text-foreground"
                  }
                >
                  {b}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
