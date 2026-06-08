import { Suspense } from "react";
import { FixturesSection } from "@/components/sections/fixtures";
import { CountdownWidget } from "@/components/widgets/countdown-widget";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { footballDataProvider } from "@/lib/football-api/provider";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("partidos");

function FixturesFallback() {
  return (
    <div className="section-shell py-14 sm:py-20">
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="glass-heavy h-48 animate-pulse rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default async function PartidosPage() {
  const fixturesRes = await footballDataProvider.getFixtures();

  return (
    <MarketingPageMain>
      <Breadcrumbs
        items={[
          { name: "Inicio", path: "/" },
          { name: PAGE_SEO.partidos.h1 }
        ]}
      />
      <PageIntro config={PAGE_SEO.partidos} kicker="Competiciones" />
      <PageContentAds page="partidos">
        <CountdownWidget />
        <Suspense fallback={<FixturesFallback />}>
          <FixturesSection
            initialFixtures={fixturesRes.data}
            initialSource={fixturesRes.source}
          />
        </Suspense>
      </PageContentAds>
    </MarketingPageMain>
  );
}
