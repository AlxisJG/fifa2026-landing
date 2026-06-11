"use client";

import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { BrightcoveBroadcastView } from "@/components/video/brightcove-broadcast-view";

export default function TransmisionPage() {
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
