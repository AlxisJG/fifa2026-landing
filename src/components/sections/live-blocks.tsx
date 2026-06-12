"use client";

import { FeaturedMatchCenter } from "@/components/widgets/featured-match-center";
import { LiveMatchTicker } from "@/components/widgets/live-match-ticker";
import { FootballLiveSectionsGate } from "@/components/football/football-live-sections-gate";
import { LiveFootballProvider } from "@/contexts/live-football-context";
import { getFeaturedMatchSeed, getTickerSeed } from "@/lib/football-widget-seeds";
import type { FeaturedMatch, TickerItem } from "@/lib/football-api/types";

type TransmisionLiveBlockProps = {
  /** Home: marketing CTAs + datos SSR. Transmisión: scroll en la misma página. */
  ctaMode?: "transmision" | "marketing";
  initialMatch?: FeaturedMatch;
  initialTicker?: TickerItem[];
  initialSource?: "live" | "demo";
  /** Dentro de #hero-actions: sin section-shell duplicado. */
  embedded?: boolean;
};

/** Marcador en vivo + partido destacado (transmisión y home). */
export function TransmisionLiveBlock({
  ctaMode = "transmision",
  initialMatch,
  initialTicker,
  initialSource,
  embedded = false
}: TransmisionLiveBlockProps = {}) {
  return (
    <LiveFootballProvider
      initialMatch={initialMatch ?? getFeaturedMatchSeed()}
      initialTicker={initialTicker ?? getTickerSeed()}
      initialSource={initialSource}
    >
      <FootballLiveSectionsGate>
        <LiveMatchTicker embedded={embedded} />
      </FootballLiveSectionsGate>
      <FootballLiveSectionsGate>
        <FeaturedMatchCenter ctaMode={ctaMode} />
      </FootballLiveSectionsGate>
    </LiveFootballProvider>
  );
}
