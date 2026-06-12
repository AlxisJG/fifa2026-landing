import type { ReactNode } from "react";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { TransmisionBottomAd } from "@/components/ads/transmission-player-ad";
import { getPageHorizontalPlacements, type PageAdKey } from "@/lib/page-ads";

type PageContentAdsProps = {
  page: PageAdKey;
  children: ReactNode;
};

export function PageContentAds({ page, children }: PageContentAdsProps) {
  const { top, bottom } = getPageHorizontalPlacements(page);

  return (
    <>
      <HorizontalAdSlot
        id={top.id}
        title={top.title}
        placement={top.placement}
        variant="leaderboard"
      />
      {children}
      {page === "transmision" ? (
        <TransmisionBottomAd />
      ) : (
        <HorizontalAdSlot
          id={bottom.id}
          title={bottom.title}
          placement={bottom.placement}
          variant="leaderboard"
        />
      )}
    </>
  );
}
