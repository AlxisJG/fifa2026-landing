import { Suspense } from "react";
import { NewsGridSection } from "@/components/sections/news-grid-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("noticias");

function NewsGridFallback() {
  return <div className="section-shell pb-16 sm:pb-20 h-96 animate-pulse rounded-3xl bg-slate-100" />;
}

export default function NoticiasPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.noticias} kicker="Noticias" />
      <PageContentAds page="noticias">
        <Suspense fallback={<NewsGridFallback />}>
          <NewsGridSection />
        </Suspense>
      </PageContentAds>
    </MarketingPageMain>
  );
}
