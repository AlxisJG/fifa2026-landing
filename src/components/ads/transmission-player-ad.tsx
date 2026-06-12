"use client";

import { ResponsiveSponsorBanner } from "@/components/ads/responsive-sponsor-banner";
import { BRILLANTE_BANNER_ASSETS } from "@/data/sponsor-banner-assets";
import { getPageHorizontalPlacements } from "@/lib/page-ads";

/**
 * Banner Brillante en el slot horizontal inferior de `/transmision`
 * (`Transmisión · inferior` / `leaderboard-transmision-bottom`).
 */
export function TransmisionBottomAd() {
  const { bottom } = getPageHorizontalPlacements("transmision");

  return (
    <ResponsiveSponsorBanner
      assets={BRILLANTE_BANNER_ASSETS}
      slotId={bottom.id}
      placement={bottom.placement}
    />
  );
}
