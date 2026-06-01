import { MatchSummariesSection } from "@/components/sections/match-summaries";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("highlights");

export default function HighlightsPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.highlights} kicker="Destacados" />
      <MatchSummariesSection />
    </MarketingPageMain>
  );
}
