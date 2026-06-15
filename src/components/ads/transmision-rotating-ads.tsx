"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ResponsiveSponsorBanner } from "@/components/ads/responsive-sponsor-banner";
import { getPageHorizontalPlacements } from "@/lib/page-ads";
import {
  getTransmissionSponsorIndex,
  TRANSMISSION_SPONSOR_ROTATION_MS
} from "@/lib/sponsor-rotation";
import { TRANSMISSION_ROTATING_SPONSORS } from "@/data/sponsor-banner-assets";

type TransmisionRotatingAdsProps = {
  children: ReactNode;
};

/**
 * Slots superior e inferior de `/transmision` — rotan entre Domino's, Brillante y AES Dominicana.
 */
export function TransmisionRotatingAds({ children }: TransmisionRotatingAdsProps) {
  const { top, bottom } = getPageHorizontalPlacements("transmision");
  const [index, setIndex] = useState(() => getTransmissionSponsorIndex());

  useEffect(() => {
    const sync = () => setIndex(getTransmissionSponsorIndex());
    const id = window.setInterval(sync, TRANSMISSION_SPONSOR_ROTATION_MS);
    return () => window.clearInterval(id);
  }, []);

  const assets = TRANSMISSION_ROTATING_SPONSORS[index];

  return (
    <>
      <ResponsiveSponsorBanner assets={assets} slotId={top.id} placement={top.placement} />
      {children}
      <ResponsiveSponsorBanner assets={assets} slotId={bottom.id} placement={bottom.placement} />
    </>
  );
}
