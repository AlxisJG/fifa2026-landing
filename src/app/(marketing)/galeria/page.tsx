import { GallerySection } from "@/components/sections/gallery";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("galeria");

export default function GaleriaPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.galeria} kicker="Multimedia" />
      <PageContentAds page="galeria">
        <GallerySection />
      </PageContentAds>
    </MarketingPageMain>
  );
}
