import type { Metadata } from "next";
import TraceLabDemo from "@/components/demos/TraceLabDemo";

export const metadata: Metadata = {
  title: "Trace Lab demo",
  description: "Interactive demo of Trace Lab: review AI answers step by step, label them, and run judges on a golden set. Sample data.",
};

export default function Page() {
  return <TraceLabDemo />;
}
