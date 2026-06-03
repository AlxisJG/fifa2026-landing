import { MatchSummariesSection } from "@/components/sections/match-summaries";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("highlights");

export default function HighlightsPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.highlights} kicker="Destacados" />
      <PageContentAds page="highlights">
        <MatchSummariesSection />
      </PageContentAds>
    </MarketingPageMain>
  );
}
