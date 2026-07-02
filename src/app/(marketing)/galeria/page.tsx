import { Suspense } from "react";
import { GallerySection } from "@/components/sections/gallery";
import { GalleryVideoSection } from "@/components/sections/gallery-video-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

/** 5 min — sync with WORDPRESS_CACHE_SECONDS in src/lib/cache/wordpress.ts */
export const revalidate = 300;

export const metadata = buildPageMetadata("galeria");

function GalleryFallback() {
  return <div className="section-shell h-96 animate-pulse rounded-3xl bg-slate-100 pb-16 sm:pb-20" />;
}

export default function GaleriaPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.galeria} kicker="Multimedia" />
      <PageContentAds page="galeria">
        <GalleryVideoSection />
        <Suspense fallback={<GalleryFallback />}>
          <GallerySection />
        </Suspense>
      </PageContentAds>
    </MarketingPageMain>
  );
}
