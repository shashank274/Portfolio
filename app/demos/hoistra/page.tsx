import type { Metadata } from "next";
import HoistraDemo from "@/components/demos/HoistraDemo";

export const metadata: Metadata = {
  title: "Hoistra demo",
  description: "Interactive demo of Hoistra, an AI platform for facilities teams, running on sample data.",
};

export default function Page() {
  return <HoistraDemo />;
}
