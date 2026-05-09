import { PopupAd } from "@/components/sections/popup-ad";
import { TopNav } from "@/components/sections/top-nav";
import { Hero } from "@/components/sections/hero";
import { FeaturedNewsSection } from "@/components/sections/featured-news";
import { SponsorBar } from "@/components/sections/sponsor-bar";
import { CountdownSection } from "@/components/sections/countdown";
import { FixturesSection } from "@/components/sections/fixtures";
import { NewsSection } from "@/components/sections/news";
import { GallerySection } from "@/components/sections/gallery";
import { LiveStreamSection } from "@/components/sections/live-stream";
import { SocialSection } from "@/components/sections/social";
import { FooterSection } from "@/components/sections/footer";
import { AmbientBackground } from "@/components/ui/ambient-bg";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { FloatingSideAds } from "@/components/ads/floating-side-ads";
import { StickyMobileAd } from "@/components/ads/sticky-mobile-ad";
import { LiveMatchTicker } from "@/components/widgets/live-match-ticker";
import { FeaturedMatchCenter } from "@/components/widgets/featured-match-center";
import { CountdownWidget } from "@/components/widgets/countdown-widget";
import { FixturesWidget } from "@/components/widgets/fixtures-widget";
import { StandingsWidget } from "@/components/widgets/standings-widget";
import { StatoriumEmbedPlaceholder } from "@/components/widgets/statorium-embed-placeholder";
import { adInventoryNotes } from "@/data/worldcup-widgets";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden pb-20 md:pb-0">
      <AmbientBackground />
      <TopNav />
      <FloatingSideAds />
      <PopupAd />
      <Hero />
      <LiveMatchTicker />
      <FeaturedMatchCenter />
      <div className="bg-white/70">
        <FeaturedNewsSection />
      </div>
      <CountdownWidget />
      <div className="bg-sky-50/70">
        <SponsorBar />
      </div>
      <HorizontalAdSlot
        title="Premium Horizontal Sponsor"
        sizeLabel="Desktop 728x90 | Mobile 300x50"
        placement="After Hero / Sponsor Intro"
        variant="default"
      />
      <div className="bg-white/70">
        <CountdownSection />
      </div>
      <div className="bg-amber-50/40">
        <FixturesSection />
      </div>
      <FixturesWidget />
      <StandingsWidget />
      <StatoriumEmbedPlaceholder />
      <HorizontalAdSlot
        title="Leaderboard Ad 728x90"
        sizeLabel="Desktop 728x90 | Mobile 300x50"
        placement="After Countdown + Fixtures"
        variant="leaderboard"
      />
      <HorizontalAdSlot
        title="Match Day Sponsor Placement"
        sizeLabel="Desktop 728x90 | Mobile 300x50"
        placement="Before News & Highlights"
        variant="matchday"
      />
      <div className="bg-white/75">
        <NewsSection />
      </div>
      <div className="bg-sky-50/60">
        <GallerySection />
      </div>
      <HorizontalAdSlot
        title="Premium Horizontal Sponsor"
        sizeLabel="Desktop 728x90 | Mobile 300x50"
        placement="Before Live Stream"
        variant="leaderboard"
      />
      <div className="bg-white/80">
        <LiveStreamSection />
      </div>
      <HorizontalAdSlot
        title="Match Day Sponsor Placement"
        sizeLabel="Desktop 728x90 | Mobile 300x50"
        placement="After Live Stream"
        variant="default"
      />
      <div className="bg-amber-50/35">
        <SocialSection />
      </div>
      <section className="section-shell pb-8">
        <div className="glass rounded-2xl border border-slate-300 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Commercial Inventory Notes</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {adInventoryNotes.map((note) => (
              <span key={note} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-700">
                {note}
              </span>
            ))}
          </div>
        </div>
      </section>
      <FooterSection />

      <StickyMobileAd />
    </main>
  );
}
