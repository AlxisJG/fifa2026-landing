"use client";

import type { AdPlacement } from "@/data/ad-placements";
import { AD_SIZES } from "@/lib/ad-sizes";
import { AdSlotFrame } from "@/components/ads/ad-slot-frame";
import { isAdsEnabled } from "@/lib/ads-gate";

type SideRailAdProps = {
  placement: AdPlacement;
  variant?: "left" | "right";
  className?: string;
};

export function SideRailAd({ placement, variant = "left", className = "" }: SideRailAdProps) {
  if (!isAdsEnabled()) return null;

  return (
    <div className={`hidden shrink-0 xl:block ${className}`}>
      <AdSlotFrame
        format="skyscraper"
        id={placement.id}
        title={placement.title}
        placement={placement.placement}
        activeSizeLabel={AD_SIZES.skyscraper.label}
        className={variant === "left" ? "xl:mr-0" : "xl:ml-0"}
      />
    </div>
  );
}
