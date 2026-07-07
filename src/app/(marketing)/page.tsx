import { PopupAd } from "@/components/sections/popup-ad";
import { Hero } from "@/components/sections/hero";
import { SeoIntroSection } from "@/components/sections/seo-intro";
import { SponsorBar } from "@/components/sections/sponsor-bar";
import { LatestNewsSection } from "@/components/sections/latest-news-section";
import { CountdownWidget } from "@/components/widgets/countdown-widget";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { StickyMobileAd } from "@/components/ads/sticky-mobile-ad";
import { HomepageJsonLd } from "@/components/seo/homepage-json-ld";
import { isAdsEnabled } from "@/lib/ads-gate";
import { footballDataProvider } from "@/lib/football-api/provider";
import { getPosts } from "@/lib/posts";
import { resolveOpeningKickoffMs, shouldShowWorldCupCountdown } from "@/lib/world-cup-kickoff";
import type { Metadata } from "next";
import { buildSocialMetadata } from "@/lib/seo/metadata-shared";
import { WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS } from "@/lib/cache/wordpress";
import { HOME_SEO, SITE_URL } from "@/lib/seo/site";

export const revalidate = WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: { absolute: HOME_SEO.title },
  description: HOME_SEO.description,
  alternates: { canonical: SITE_URL },
  ...buildSocialMetadata({
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    path: "/",
    imageAlt: HOME_SEO.h1
  })
};

export default async function HomePage() {
  const adsEnabled = isAdsEnabled();
  const [posts, fixturesRes, liveFootballRes] = await Promise.all([
    getPosts(),
    footballDataProvider.getFixtures(),
    footballDataProvider.getLiveFootball()
  ]);
  const countdownTargetMs = resolveOpeningKickoffMs(
    fixturesRes.data,
    liveFootballRes.data.match.kickoffAt
  );
  const showCountdown = shouldShowWorldCupCountdown(
    fixturesRes.data,
    liveFootballRes.data.match.kickoffAt
  );

  return (
    <>
      <HomepageJsonLd posts={posts} fixtures={fixturesRes.data} />
      <PopupAd />
      <MarketingPageMain>
        <Hero
          belowActions={
            <TransmisionLiveBlock
              embedded
              ctaMode="marketing"
              initialMatch={liveFootballRes.data.match}
              initialTicker={liveFootballRes.data.ticker}
              initialSource={liveFootballRes.source}
            />
          }
        />
        <PageContentAds page="home">
          <SeoIntroSection />
          {showCountdown && <CountdownWidget targetMs={countdownTargetMs} />}
          <LatestNewsSection initialPosts={posts} />
          <SponsorBar />
        </PageContentAds>
      </MarketingPageMain>
      {adsEnabled && <StickyMobileAd />}
    </>
  );
}
