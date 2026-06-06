"use client";

import { FeaturedMatchCenter } from "@/components/widgets/featured-match-center";
import { LiveMatchTicker } from "@/components/widgets/live-match-ticker";
import { FootballLiveSectionsGate } from "@/components/football/football-live-sections-gate";

/** Bloque en vivo de `/transmision` — marcador y partido destacado. */
export function TransmisionLiveBlock() {
  return (
    <>
      <FootballLiveSectionsGate>
        <LiveMatchTicker />
      </FootballLiveSectionsGate>
      <FootballLiveSectionsGate>
        <FeaturedMatchCenter />
      </FootballLiveSectionsGate>
    </>
  );
}
