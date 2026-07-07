import { Suspense } from "react";
import { GallerySection } from "@/components/sections/gallery";
import { GalleryVideoSection } from "@/components/sections/gallery-video-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS } from "@/lib/cache/wordpress";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const revalidate = WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS;

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
