"use client";

import { useEffect } from "react";
import type { GamSlotConfig } from "@/data/gam-placements";
import { enableGptServicesOnce, ensureGptScript } from "@/lib/gpt-loader";

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

      const alreadyDefined = googletag
        .pubads()
        .getSlots()
        .some((definedSlot) => definedSlot.getSlotElementId() === slot.slotId);

      if (!alreadyDefined) {
        googletag.defineSlot(slot.adUnitPath, slot.sizes, slot.slotId)?.addService(googletag.pubads());
      }

      enableGptServicesOnce();
      googletag.display(slot.slotId);
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
