"use client";

import { useEffect } from "react";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { BrightcoveBroadcastView } from "@/components/video/brightcove-broadcast-view";
import { ACTIVE_BRIGHTCOVE_LIVE_STREAMS } from "@/lib/brightcove-live-config";
import { prefetchBrightcovePlayerScript } from "@/lib/brightcove-player-loader";

export default function TransmisionPage() {
  useEffect(() => {
    const primaryStream = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0];
    if (primaryStream) {
      prefetchBrightcovePlayerScript(primaryStream.playerId);
    }
  }, []);

  return (
    <MarketingPageMain>
      <PageContentAds page="transmision">
        <section className="section-shell py-8 sm:py-10">
          <TransmisionLiveBlock />
          <BrightcoveBroadcastView className="mt-5" />
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
