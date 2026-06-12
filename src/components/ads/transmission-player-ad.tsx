"use client";

import { GptAdSlot } from "@/components/ads/gpt-ad-slot";
import { getTransmissionPlayerGamSlot, transmissionPlayerGamSlot } from "@/data/gam-placements";
import { isGamTransmissionPlayerAdEnabled } from "@/lib/ads-gate";

/**
 * GAM `/22818118543/Bri001` below the Brightcove player on `/transmision`.
 * En dev usa unidad demo de Google salvo NEXT_PUBLIC_GAM_USE_PRODUCTION_UNIT=true.
 */
export function TransmissionPlayerAd() {
  if (!isGamTransmissionPlayerAdEnabled()) {
    return null;
  }

  const slot = getTransmissionPlayerGamSlot();
  const isDevTestSlot = slot.adUnitPath !== transmissionPlayerGamSlot.adUnitPath;

  return (
    <div className="flex w-full flex-col items-center gap-2 overflow-hidden rounded-xl bg-black/20 py-2">
      {isDevTestSlot ? (
        <p className="px-3 text-center text-[10px] uppercase tracking-[0.12em] text-amber-200/80">
          Modo prueba GAM (unidad demo Google) — prod usa {transmissionPlayerGamSlot.adUnitPath}
        </p>
      ) : null}
      <GptAdSlot slot={slot} className="mx-auto flex w-full items-center justify-center" />
    </div>
  );
}
