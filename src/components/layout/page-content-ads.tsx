import type { ReactNode } from "react";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { ResponsiveSponsorBanner } from "@/components/ads/responsive-sponsor-banner";
import { TransmisionBottomAd } from "@/components/ads/transmission-player-ad";
import { BRUGAL_BANNER_ASSETS, DOMINOS_BANNER_ASSETS } from "@/data/sponsor-banner-assets";
import { getPageHorizontalPlacements, type PageAdKey } from "@/lib/page-ads";

type PageContentAdsProps = {
  page: PageAdKey;
  children: ReactNode;
};

function DominosTopAd({ page }: { page: "home" | "transmision" }) {
  const { top } = getPageHorizontalPlacements(page);

  return (
    <ResponsiveSponsorBanner
      assets={DOMINOS_BANNER_ASSETS}
      slotId={top.id}
      placement={top.placement}
    />
  );
}

export function PageContentAds({ page, children }: PageContentAdsProps) {
  const { top, bottom } = getPageHorizontalPlacements(page);

  if (page === "noticias") {
    return (
      <>
        <ResponsiveSponsorBanner assets={BRUGAL_BANNER_ASSETS} slotId={top.id} placement={top.placement} />
        {children}
        <ResponsiveSponsorBanner assets={BRUGAL_BANNER_ASSETS} slotId={bottom.id} placement={bottom.placement} />
      </>
    );
  }

  if (page === "home") {
    return (
      <>
        <DominosTopAd page="home" />
        {children}
        <HorizontalAdSlot
          id={bottom.id}
          title={bottom.title}
          placement={bottom.placement}
          variant="leaderboard"
        />
      </>
    );
  }

  if (page === "transmision") {
    return (
      <>
        <DominosTopAd page="transmision" />
        {children}
        <TransmisionBottomAd />
      </>
    );
  }

  return (
    <>
      <HorizontalAdSlot
        id={top.id}
        title={top.title}
        placement={top.placement}
        variant="leaderboard"
      />
      {children}
      <HorizontalAdSlot
        id={bottom.id}
        title={bottom.title}
        placement={bottom.placement}
        variant="leaderboard"
      />
    </>
  );
}
