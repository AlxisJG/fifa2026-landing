import { PosicionesSection } from "@/components/sections/posiciones-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("posiciones");

export default function PosicionesPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.posiciones} kicker="Estadísticas" />
      <PosicionesSection />
    </MarketingPageMain>
  );
}
