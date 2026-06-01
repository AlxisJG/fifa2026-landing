import { NewsGridSection } from "@/components/sections/news-grid-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("noticias");

export default function NoticiasPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.noticias} kicker="Noticias" />
      <NewsGridSection />
    </MarketingPageMain>
  );
}
