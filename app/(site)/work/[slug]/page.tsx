import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { CaseBody } from "@/components/site/CaseBody";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.name}: ${p.tagline}`;
  return {
    title,
    description: p.summary.business,
    openGraph: { title, description: p.summary.business, url: `/work/${p.slug}`, images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  return <CaseBody p={projects[i]} next={projects[(i + 1) % projects.length]} />;
}
