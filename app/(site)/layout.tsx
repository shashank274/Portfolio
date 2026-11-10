import { LensProvider } from "@/lib/lens";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LensProvider>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </LensProvider>
  );
}
