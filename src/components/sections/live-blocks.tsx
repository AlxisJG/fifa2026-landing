"use client";

import { FeaturedMatchCenter } from "@/components/widgets/featured-match-center";
import { LiveMatchTicker } from "@/components/widgets/live-match-ticker";
import { LiveStreamSection } from "@/components/sections/live-stream";
import { FootballLiveSectionsGate } from "@/components/football/football-live-sections-gate";

/** Bloque en vivo exclusivo de `/transmision` (requiere cuenta + plan). */
export function TransmisionLiveBlock() {
  return (
    <>
      <FootballLiveSectionsGate>
        <LiveMatchTicker />
      </FootballLiveSectionsGate>
      <FootballLiveSectionsGate>
        <FeaturedMatchCenter />
      </FootballLiveSectionsGate>
      <FootballLiveSectionsGate>
        <LiveStreamSection />
      </FootballLiveSectionsGate>
    </>
  );
}
