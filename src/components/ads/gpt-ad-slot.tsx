"use client";

import { useEffect } from "react";
import type { GamSlotConfig } from "@/data/gam-placements";
import {
  enableGptServicesOnce,
  ensureGptScript,
  hasGptSlotBeenDefined,
  hasGptSlotBeenDisplayed,
  markGptSlotDefined,
  markGptSlotDisplayed
} from "@/lib/gpt-loader";
import { applyGptSizeMapping } from "@/lib/gpt-size-mapping";

type GptAdSlotProps = {
  slot: GamSlotConfig;
  className?: string;
};

export function GptAdSlot({ slot, className = "" }: GptAdSlotProps) {
  useEffect(() => {
    ensureGptScript();

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      const googletag = window.googletag;
      if (!googletag?.defineSlot || !googletag.pubads || !googletag.display) {
        return;
      }

      if (!hasGptSlotBeenDefined(slot.slotId)) {
        const defined = googletag.defineSlot(slot.adUnitPath, slot.sizes, slot.slotId);
        if (!defined) {
          return;
        }

        if (slot.sizeMapping?.length) {
          const mapping = applyGptSizeMapping(googletag, slot.sizeMapping);
          if (mapping) {
            defined.defineSizeMapping(mapping);
          }
        }

        defined.addService(googletag.pubads());
        markGptSlotDefined(slot.slotId);
      }

      enableGptServicesOnce();

      // Evita re-display en re-renders / Strict Mode — cada refresh puede alternar creativo.
      if (!hasGptSlotBeenDisplayed(slot.slotId)) {
        googletag.display(slot.slotId);
        markGptSlotDisplayed(slot.slotId);
      }
    });
  }, [slot]);

  return (
    <div
      id={slot.slotId}
      className={className}
      style={{ minWidth: slot.minWidth, minHeight: slot.minHeight }}
    />
  );
}
