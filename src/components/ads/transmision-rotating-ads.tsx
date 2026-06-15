"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { ResponsiveSponsorBanner } from "@/components/ads/responsive-sponsor-banner";
import { getPageHorizontalPlacements } from "@/lib/page-ads";
import {
  getTransmissionSponsorIndex,
  TRANSMISSION_SPONSOR_ROTATION_MS
} from "@/lib/sponsor-rotation";
import { TRANSMISSION_ROTATING_SPONSORS, type SponsorBannerAssets } from "@/data/sponsor-banner-assets";

type TransmisionSponsorRotationValue = {
  assets: SponsorBannerAssets;
};

const TransmisionSponsorRotationContext = createContext<TransmisionSponsorRotationValue | null>(
  null
);

function useTransmisionSponsorRotation(): TransmisionSponsorRotationValue {
  const value = useContext(TransmisionSponsorRotationContext);
  if (!value) {
    throw new Error("TransmisionRotatingBottomAd must be used within TransmisionRotatingAds");
  }
  return value;
}

type TransmisionRotatingAdsProps = {
  children: ReactNode;
};

/**
 * Slot superior de `/transmision` + contexto de rotación para el inferior (junto al player).
 */
export function TransmisionRotatingAds({ children }: TransmisionRotatingAdsProps) {
  const { top } = getPageHorizontalPlacements("transmision");
  const [index, setIndex] = useState(() => getTransmissionSponsorIndex());

  useEffect(() => {
    const sync = () => setIndex(getTransmissionSponsorIndex());
    const id = window.setInterval(sync, TRANSMISSION_SPONSOR_ROTATION_MS);
    return () => window.clearInterval(id);
  }, []);

  const assets = TRANSMISSION_ROTATING_SPONSORS[index];
  const value = useMemo(() => ({ assets }), [assets]);

  return (
    <TransmisionSponsorRotationContext.Provider value={value}>
      <ResponsiveSponsorBanner
        assets={assets}
        slotId={top.id}
        placement={top.placement}
        transmisionTop
      />
      {children}
    </TransmisionSponsorRotationContext.Provider>
  );
}

/** Banner inferior — colocar justo debajo del reproductor Brightcove. */
export function TransmisionRotatingBottomAd({ className = "" }: { className?: string }) {
  const { assets } = useTransmisionSponsorRotation();
  const { bottom } = getPageHorizontalPlacements("transmision");

  return (
    <ResponsiveSponsorBanner
      assets={assets}
      slotId={bottom.id}
      placement={bottom.placement}
      compact
      className={className}
    />
  );
}
