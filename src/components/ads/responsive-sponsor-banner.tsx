"use client";

import Image from "next/image";
import { AD_SIZES } from "@/lib/ad-sizes";
import type { SponsorBannerAssets } from "@/data/sponsor-banner-assets";

type ResponsiveSponsorBannerProps = {
  assets: SponsorBannerAssets;
  slotId: string;
  placement: string;
};

/**
 * Banner horizontal patrocinador con artes por breakpoint.
 * Siempre visible — no usa `NEXT_PUBLIC_ENABLE_AD_SLOTS`.
 */
function isAnimatedAsset(src: string): boolean {
  return src.endsWith(".gif");
}

export function ResponsiveSponsorBanner({ assets, slotId, placement }: ResponsiveSponsorBannerProps) {
  const unoptimized =
    isAnimatedAsset(assets.desktopWide.src) ||
    isAnimatedAsset(assets.desktop.src) ||
    isAnimatedAsset(assets.mobile.src);

  return (
    <section className="section-shell py-6 sm:py-8">
      <div
        className="flex flex-col items-center gap-3"
        data-ad-slot={slotId}
        data-ad-placement={placement}
      >
        <Image
          src={assets.desktopWide.src}
          alt={assets.alt}
          width={assets.desktopWide.width}
          height={assets.desktopWide.height}
          unoptimized={unoptimized}
          className={`mx-auto h-auto max-w-full ${AD_SIZES["super-leaderboard"].visibilityClass}`}
        />
        <Image
          src={assets.desktop.src}
          alt={assets.alt}
          width={assets.desktop.width}
          height={assets.desktop.height}
          unoptimized={unoptimized}
          className={`mx-auto h-auto max-w-full ${AD_SIZES.leaderboard.visibilityClass}`}
        />
        <Image
          src={assets.mobile.src}
          alt={assets.alt}
          width={assets.mobile.width}
          height={assets.mobile.height}
          unoptimized={unoptimized}
          className={`mx-auto h-auto max-w-full ${AD_SIZES["mobile-banner"].visibilityClass}`}
        />
      </div>
    </section>
  );
}
