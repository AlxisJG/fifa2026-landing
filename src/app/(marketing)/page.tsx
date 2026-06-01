import { PopupAd } from "@/components/sections/popup-ad";
import { Hero } from "@/components/sections/hero";
import { SeoIntroSection } from "@/components/sections/seo-intro";
import { SponsorBar } from "@/components/sections/sponsor-bar";
import { LatestNewsSection } from "@/components/sections/latest-news-section";
import { CountdownWidget } from "@/components/widgets/countdown-widget";
import { FeaturedMatchCenter } from "@/components/widgets/featured-match-center";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { StickyMobileAd } from "@/components/ads/sticky-mobile-ad";
import { isAdsEnabled } from "@/lib/ads-gate";
import type { Metadata } from "next";
import { HOME_SEO, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: HOME_SEO.title,
    description: HOME_SEO.description
  }
};

export default function HomePage() {
  const adsEnabled = isAdsEnabled();

  return (
    <>
      <PopupAd />
      <MarketingPageMain>
        <Hero />
        <PageContentAds page="home">
          <SeoIntroSection />
          <CountdownWidget />
          <LatestNewsSection />
          <FeaturedMatchCenter ctaMode="marketing" />
          <SponsorBar />
        </PageContentAds>
      </MarketingPageMain>
      {adsEnabled && <StickyMobileAd />}
    </>
  );
}
