import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow text-accent-ink">404</p>
      <h1 className="font-display mt-4 text-6xl text-foreground md:text-8xl">This page doesn&apos;t exist.</h1>
      <Link href="/" className="link-underlined mt-8 w-fit text-accent-ink">← Back home</Link>
    </section>
  );
}
