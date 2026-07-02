"use client";

import { useEffect } from "react";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { TransmisionRotatingBottomAd } from "@/components/ads/transmision-rotating-ads";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { BrightcoveBroadcastView } from "@/components/video/brightcove-broadcast-view";
import { ACTIVE_BRIGHTCOVE_LIVE_STREAMS } from "@/lib/brightcove-live-config";
import { prefetchBrightcovePlayerScript } from "@/lib/brightcove-player-loader";
import type { FeaturedMatch, TickerItem } from "@/lib/football-api/types";
import type { LiveTransmissionStatus } from "@/lib/live-transmission-status";

type TransmisionPageProps = {
  initialLiveStatus: LiveTransmissionStatus;
  initialMatch?: FeaturedMatch;
  initialTicker?: TickerItem[];
  initialSource?: "live" | "demo";
};

export default function TransmisionPage({
  initialLiveStatus,
  initialMatch,
  initialTicker,
  initialSource
}: TransmisionPageProps) {
  useEffect(() => {
    const activeStreamIds = new Set(
      initialLiveStatus.streams.filter((stream) => stream.active).map((stream) => stream.id)
    );
    const primaryStream =
      ACTIVE_BRIGHTCOVE_LIVE_STREAMS.find((stream) => activeStreamIds.has(stream.id)) ??
      ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0];
    if (primaryStream) {
      prefetchBrightcovePlayerScript(primaryStream.playerId);
    }
  }, [initialLiveStatus.streams]);

  return (
    <MarketingPageMain>
      <PageContentAds page="transmision">
        <section className="section-shell native-transmision-shell pb-4">
          <TransmisionLiveBlock
            embedded
            embeddedTopClassName="mt-0"
            initialMatch={initialMatch}
            initialTicker={initialTicker}
            initialSource={initialSource}
          />
          <BrightcoveBroadcastView className="mt-5" initialLiveStatus={initialLiveStatus} />
          <TransmisionRotatingBottomAd className="mt-2 sm:mt-3" />
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
