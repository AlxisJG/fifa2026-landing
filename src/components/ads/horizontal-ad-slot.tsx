"use client";

import { AdSlotFrame } from "@/components/ads/ad-slot-frame";
import { AD_SIZES } from "@/lib/ad-sizes";
import { isAdsEnabled } from "@/lib/ads-gate";

type HorizontalAdSlotProps = {
  id?: string;
  title: string;
  placement: string;
  variant?: "default" | "leaderboard" | "matchday";
};

export function HorizontalAdSlot({
  id,
  title,
  placement,
  variant = "default"
}: HorizontalAdSlotProps) {
  if (!isAdsEnabled()) return null;

  return (
    <section className="section-shell py-6 sm:py-8">
      <div className="flex flex-col items-center gap-3">
        <AdSlotFrame
          format="super-leaderboard"
          id={id ? `${id}-970` : undefined}
          title={title}
          placement={placement}
          activeSizeLabel={AD_SIZES["super-leaderboard"].label}
          variant={variant}
        />
        <AdSlotFrame
          format="leaderboard"
          id={id}
          title={title}
          placement={placement}
          activeSizeLabel={AD_SIZES.leaderboard.label}
          variant={variant}
        />
        <AdSlotFrame
          format="mobile-banner"
          id={id ? `${id}-mobile` : undefined}
          title={title}
          placement={placement}
          activeSizeLabel={AD_SIZES["mobile-banner"].label}
          variant={variant}
        />
      </div>
    </section>
  );
}
