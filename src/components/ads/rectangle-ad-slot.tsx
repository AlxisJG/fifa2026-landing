"use client";

import type { AdPlacement } from "@/data/ad-placements";
import { AD_SIZES } from "@/lib/ad-sizes";
import { AdSlotFrame } from "@/components/ads/ad-slot-frame";
import { isAdsEnabled } from "@/lib/ads-gate";

type RectangleAdSlotProps = {
  placement: AdPlacement;
  className?: string;
  /** En columna estrecha usa banner móvil; en ancha usa MPU 300×250 */
  responsive?: boolean;
};

export function RectangleAdSlot({ placement, className = "", responsive = false }: RectangleAdSlotProps) {
  if (!isAdsEnabled()) return null;

  if (responsive) {
    return (
      <div className={`w-full ${className}`}>
        <AdSlotFrame
          format="medium-rectangle"
          id={placement.id}
          title={placement.title}
          placement={placement.placement}
          activeSizeLabel={AD_SIZES["medium-rectangle"].label}
          className="hidden sm:block"
        />
        <AdSlotFrame
          format="mobile-banner"
          id={`${placement.id}-mobile`}
          title={placement.title}
          placement={placement.placement}
          activeSizeLabel={AD_SIZES["mobile-banner"].label}
          variant="matchday"
          className="sm:hidden"
        />
      </div>
    );
  }

  return (
    <AdSlotFrame
      format="medium-rectangle"
      id={placement.id}
      title={placement.title}
      placement={placement.placement}
      className={className}
    />
  );
}
