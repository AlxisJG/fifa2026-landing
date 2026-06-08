import { PosicionesSection } from "@/components/sections/posiciones-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { footballDataProvider } from "@/lib/football-api/provider";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("posiciones");

export default async function PosicionesPage() {
  const standingsRes = await footballDataProvider.getStandings();

  return (
    <MarketingPageMain>
      <Breadcrumbs
        items={[
          { name: "Inicio", path: "/" },
          { name: PAGE_SEO.posiciones.h1 }
        ]}
      />
      <PageIntro config={PAGE_SEO.posiciones} kicker="Estadísticas" />
      <PageContentAds page="posiciones">
        <PosicionesSection
          initialStandings={standingsRes.data}
          initialStandingsSource={standingsRes.source}
        />
      </PageContentAds>
    </MarketingPageMain>
  );
}
