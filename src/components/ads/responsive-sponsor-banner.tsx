"use client";

import Image from "next/image";
import { AD_SIZES } from "@/lib/ad-sizes";
import type { SponsorBannerAssets } from "@/data/sponsor-banner-assets";

type ResponsiveSponsorBannerProps = {
  assets: SponsorBannerAssets;
  slotId: string;
  placement: string;
  /** Menos padding vertical — p. ej. banner pegado al player en /transmision. */
  compact?: boolean;
  /** Superior en /transmision: clearance del logo crest + poco gap al ticker. */
  transmisionTop?: boolean;
  className?: string;
};

/**
 * Banner horizontal patrocinador con artes por breakpoint.
 * Siempre visible — no usa `NEXT_PUBLIC_ENABLE_AD_SLOTS`.
 */
function isAnimatedAsset(src: string): boolean {
  return src.endsWith(".gif");
}

export function ResponsiveSponsorBanner({
  assets,
  slotId,
  placement,
  compact = false,
  transmisionTop = false,
  className = ""
}: ResponsiveSponsorBannerProps) {
  const unoptimized =
    isAnimatedAsset(assets.desktopWide.src) ||
    isAnimatedAsset(assets.desktop.src) ||
    isAnimatedAsset(assets.mobile.src);

  const sectionPadding = transmisionTop
    ? "pt-4 pb-2 sm:pt-5 sm:pb-2.5 md:pt-11 md:pb-2.5 lg:pt-12"
    : compact
      ? "py-2 sm:py-3"
      : "py-6 sm:py-8";

  return (
    <section className={`section-shell ${sectionPadding} ${className}`.trim()}>
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
