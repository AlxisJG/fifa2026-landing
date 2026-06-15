"use client";

import { useEffect } from "react";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { TransmisionRotatingBottomAd } from "@/components/ads/transmision-rotating-ads";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { BrightcoveBroadcastView } from "@/components/video/brightcove-broadcast-view";
import { ACTIVE_BRIGHTCOVE_LIVE_STREAMS } from "@/lib/brightcove-live-config";
import { prefetchBrightcovePlayerScript } from "@/lib/brightcove-player-loader";

export default function TransmisionPage() {
  useEffect(() => {
    const playerIds = [
      ...new Set(ACTIVE_BRIGHTCOVE_LIVE_STREAMS.map((stream) => stream.playerId))
    ];
    playerIds.forEach((playerId) => prefetchBrightcovePlayerScript(playerId));
  }, []);

  return (
    <MarketingPageMain>
      <PageContentAds page="transmision">
        <section className="section-shell pb-4">
          <TransmisionLiveBlock embedded embeddedTopClassName="mt-0" />
          <BrightcoveBroadcastView className="mt-5" />
          <TransmisionRotatingBottomAd className="mt-2 sm:mt-3" />
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
