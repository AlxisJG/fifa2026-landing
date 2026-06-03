"use client";

import { AdSlotFrame } from "@/components/ads/ad-slot-frame";
import { skyscraperPlacement } from "@/data/ad-placements";
import { AD_SIZES } from "@/lib/ad-sizes";
import { isAdsEnabled } from "@/lib/ads-gate";

const SHELL_MAX = 1240;
const AD_WIDTH = AD_SIZES.skyscraper.width;
const GAP = 12;

/** Fuera del section-shell (1240px), fijo como el nav */
function railOffset(variant: "left" | "right") {
  const gutter = `max(0.75rem, calc((100vw - ${SHELL_MAX}px) / 2 - ${AD_WIDTH + GAP}px))`;
  return variant === "left" ? { left: gutter } : { right: gutter };
}

export function FixedSkyscraperAds() {
  if (!isAdsEnabled()) return null;

  const top = "calc(env(safe-area-inset-top, 0px) + 5.25rem)";

  return (
    <>
      <div
        className="pointer-events-none fixed z-30 hidden min-[1480px]:block"
        style={{ top, ...railOffset("left") }}
      >
        <div className="pointer-events-auto">
          <AdSlotFrame
            format="skyscraper"
            id={`${skyscraperPlacement.id}-left`}
            title={skyscraperPlacement.title}
            placement="Lateral · izquierda"
            activeSizeLabel={AD_SIZES.skyscraper.label}
          />
        </div>
      </div>
      <div
        className="pointer-events-none fixed z-30 hidden min-[1480px]:block"
        style={{ top, ...railOffset("right") }}
      >
        <div className="pointer-events-auto">
          <AdSlotFrame
            format="skyscraper"
            id={`${skyscraperPlacement.id}-right`}
            title={skyscraperPlacement.title}
            placement="Lateral · derecha"
            activeSizeLabel={AD_SIZES.skyscraper.label}
          />
        </div>
      </div>
    </>
  );
}
