import { FixturesSection } from "@/components/sections/fixtures";
import { CountdownWidget } from "@/components/widgets/countdown-widget";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("partidos");

export default function PartidosPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.partidos} kicker="Competiciones" />
      <CountdownWidget />
      <FixturesSection />
    </MarketingPageMain>
  );
}
