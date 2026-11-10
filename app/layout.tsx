import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "./globals.css";

const TITLE = "Shashank Kanangi · AI Engineer & Business Technology";
const DESC =
  "Data Scientist and AI Engineer. A year building AI systems for finance teams, facilities teams and marketing agencies in Dubai, now doing an MSc in Business IT Management in Amsterdam. Open to roles in the Netherlands and the UAE.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? "https://shashank-k.vercel.app" : "http://localhost:3000")),
  title: { default: TITLE, template: "%s · Shashank Kanangi" },
  description: DESC,
  authors: [{ name: "Shashank Kanangi" }],
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "en_GB", siteName: "Shashank Kanangi", url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#F4F0E8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
