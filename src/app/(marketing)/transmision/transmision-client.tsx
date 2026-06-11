"use client";

import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { BrightcoveBroadcastView } from "@/components/video/brightcove-broadcast-view";
import { isAdsEnabled } from "@/lib/ads-gate";

export default function TransmisionPage() {
  const adsEnabled = isAdsEnabled();

  return (
    <MarketingPageMain>
      <PageContentAds page="transmision">
        <section className="section-shell py-8 sm:py-10">
          <TransmisionLiveBlock />

          {adsEnabled && (
            <div className="mt-8">
              <HorizontalAdSlot
                id="transmision-pre-roll"
                title="Patrocinador en vivo"
                placement="Transmisión pre-roll"
                variant="leaderboard"
              />
            </div>
          )}

          <BrightcoveBroadcastView className="mt-5" />
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
