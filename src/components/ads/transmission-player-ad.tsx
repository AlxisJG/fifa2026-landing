"use client";

import { GptAdSlot } from "@/components/ads/gpt-ad-slot";
import { transmissionPlayerGamSlot } from "@/data/gam-placements";
import { isGamTransmissionPlayerAdEnabled } from "@/lib/ads-gate";

/**
 * GAM `/22818118543/Bri001` below the Brightcove player on `/transmision`.
 * Replaces the placeholder `leaderboard-live-player` slot; always on in production.
 */
export function TransmissionPlayerAd() {
  if (!isGamTransmissionPlayerAdEnabled()) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <GptAdSlot slot={transmissionPlayerGamSlot} className="mx-auto" />
    </div>
  );
}
