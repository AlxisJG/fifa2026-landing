"use client";

import Image from "next/image";
import { AD_SIZES } from "@/lib/ad-sizes";
import { getPageHorizontalPlacements } from "@/lib/page-ads";

const BRILLANTE_ADS = {
  desktopWide: "/ads/brillante/Brillante-Sport-750x100px-ANM.gif",
  desktop: "/ads/brillante/Brillante-Sport-728X90px-Futbol.gif",
  mobile: "/ads/brillante/Brillante-Sport-300x50px-ANM.gif"
} as const;

/**
 * Banner Brillante en el slot horizontal inferior de `/transmision`
 * (`Transmisión · inferior` / `leaderboard-transmision-bottom`).
 */
export function TransmisionBottomAd() {
  const { bottom } = getPageHorizontalPlacements("transmision");

  return (
    <section className="section-shell py-6 sm:py-8">
      <div
        className="flex flex-col items-center gap-3"
        data-ad-slot={bottom.id}
        data-ad-placement={bottom.placement}
      >
        <Image
          src={BRILLANTE_ADS.desktopWide}
          alt="Brillante Sport"
          width={750}
          height={100}
          unoptimized
          className={`mx-auto h-auto max-w-full ${AD_SIZES["super-leaderboard"].visibilityClass}`}
        />
        <Image
          src={BRILLANTE_ADS.desktop}
          alt="Brillante Sport"
          width={728}
          height={90}
          unoptimized
          className={`mx-auto h-auto max-w-full ${AD_SIZES.leaderboard.visibilityClass}`}
        />
        <Image
          src={BRILLANTE_ADS.mobile}
          alt="Brillante Sport"
          width={300}
          height={50}
          unoptimized
          className={`mx-auto h-auto max-w-full ${AD_SIZES["mobile-banner"].visibilityClass}`}
        />
      </div>
    </section>
  );
}
