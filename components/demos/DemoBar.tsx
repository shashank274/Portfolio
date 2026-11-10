import Link from "next/link";

export default function DemoBar({ project, slug, onReset }: { project: string; slug: string; onReset?: () => void }) {
  return (
    <div className="d-bar">
      <Link href={`/work/${slug}`}>← {project} project page</Link>
      <span className="d-pill">
        <span className="dot" style={{ background: "var(--accent)", animation: "none" }} />
        Interactive demo · sample data, not the live product
      </span>
      {onReset ? (
        <button type="button" className="d-btn small ghost" onClick={onReset}>
          ↺ Reset demo
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
