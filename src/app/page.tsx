import { PopupAd } from "@/components/sections/popup-ad";
import { TopNav } from "@/components/sections/top-nav";
import { Hero } from "@/components/sections/hero";
import { FeaturedNewsSection } from "@/components/sections/featured-news";
import { SponsorBar } from "@/components/sections/sponsor-bar";
import { FixturesSection } from "@/components/sections/fixtures";
import { GallerySection } from "@/components/sections/gallery";
import { LiveStreamSection } from "@/components/sections/live-stream";
import { FooterSection } from "@/components/sections/footer";
import { MatchSummariesSection } from "@/components/sections/match-summaries";
import { AmbientBackground } from "@/components/ui/ambient-bg";
import { FixedSkyscraperAds } from "@/components/ads/fixed-skyscraper-ads";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { StickyMobileAd } from "@/components/ads/sticky-mobile-ad";
import { LiveMatchTicker } from "@/components/widgets/live-match-ticker";
import { FeaturedMatchCenter } from "@/components/widgets/featured-match-center";
import { CountdownWidget } from "@/components/widgets/countdown-widget";
import { StandingsWidget } from "@/components/widgets/standings-widget";
import { horizontalPlacements } from "@/data/ad-placements";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden pb-20 md:pb-0">
      <AmbientBackground />
      <TopNav />
      <FixedSkyscraperAds />
      <PopupAd />
      <Hero />
      <CountdownWidget />
      <LiveMatchTicker />
      <HorizontalAdSlot
        id={horizontalPlacements[0].id}
        title={horizontalPlacements[0].title}
        placement={horizontalPlacements[0].placement}
        variant="default"
      />
      <FeaturedMatchCenter />
      <FeaturedNewsSection />
      <HorizontalAdSlot
        id={horizontalPlacements[1].id}
        title={horizontalPlacements[1].title}
        placement={horizontalPlacements[1].placement}
        variant="leaderboard"
      />
      <LiveStreamSection />
      <SponsorBar />
      <FixturesSection />
      <HorizontalAdSlot
        id={horizontalPlacements[2].id}
        title={horizontalPlacements[2].title}
        placement={horizontalPlacements[2].placement}
        variant="matchday"
      />
      <StandingsWidget />
      <HorizontalAdSlot
        id={horizontalPlacements[3].id}
        title={horizontalPlacements[3].title}
        placement={horizontalPlacements[3].placement}
        variant="leaderboard"
      />
      <MatchSummariesSection />
      <HorizontalAdSlot
        id={horizontalPlacements[4].id}
        title={horizontalPlacements[4].title}
        placement={horizontalPlacements[4].placement}
        variant="default"
      />
      <GallerySection />
      <HorizontalAdSlot
        id={horizontalPlacements[5].id}
        title={horizontalPlacements[5].title}
        placement={horizontalPlacements[5].placement}
        variant="matchday"
      />
      <FooterSection />
      <StickyMobileAd />
    </main>
  );
}
