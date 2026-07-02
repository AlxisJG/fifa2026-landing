import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { footballDataProvider } from "@/lib/football-api/provider";
import { isLiveTransmissionEnabled } from "@/lib/live-transmission-gate";
import { getLiveTransmissionStatusFresh } from "@/lib/live-transmission-status";
import TransmisionPage from "./transmision-client";
import type { FeaturedMatch, TickerItem } from "@/lib/football-api/types";

function canAccessTransmision(available: boolean): boolean {
  if (available) return true;
  // En desarrollo local: permite probar /transmision aunque falle el chequeo Brightcove.
  return process.env.NODE_ENV === "development" && isLiveTransmissionEnabled();
}

export const metadata: Metadata = {
  title: "Transmisión en vivo | Pio Deportes",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function TransmisionRoute() {
  const [status, liveFootballRes] = await Promise.all([
    getLiveTransmissionStatusFresh(),
    footballDataProvider.getLiveFootball().catch(() => null)
  ]);

  if (!canAccessTransmision(status.available)) {
    redirect("/");
  }

  return (
    <TransmisionPage
      initialLiveStatus={status}
      initialMatch={liveFootballRes?.data.match}
      initialTicker={liveFootballRes?.data.ticker}
      initialSource={liveFootballRes?.source}
    />
  );
}
