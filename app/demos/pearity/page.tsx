import type { Metadata } from "next";
import PearityDemo from "@/components/demos/PearityDemo";

export const metadata: Metadata = {
  title: "Pearity demo",
  description: "Interactive demo of the Pearity.ai backend flows: generation jobs, provider failover, brand credits and brand checks, on sample data.",
};

export default function Page() {
  return <PearityDemo />;
}
