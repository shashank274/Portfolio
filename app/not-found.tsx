import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
      <p className="label" style={{ margin: 0 }}>error: step not found</p>
      <h1 className="h2">This page doesn&apos;t exist.</h1>
      <Link href="/" className="btn" style={{ width: "fit-content" }}>← Back home</Link>
    </main>
  );
}
