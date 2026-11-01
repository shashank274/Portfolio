import type { Metadata } from "next";
import ERPDemo from "@/components/demos/ERPDemo";

export const metadata: Metadata = {
  title: "ERP-AI demo",
  description: "Interactive demo of the ERP-AI suite: bank reconciliation, policy checks and document extraction, on sample data.",
};

export default function Page() {
  return <ERPDemo />;
}
