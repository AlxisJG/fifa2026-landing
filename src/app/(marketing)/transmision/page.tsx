import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { footballDataProvider } from "@/lib/football-api/provider";
import { getLiveTransmissionStatusFresh } from "@/lib/live-transmission-status";
import TransmisionPage from "./transmision-client";
import type { FeaturedMatch, TickerItem } from "@/lib/football-api/types";

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

  if (!status.available) {
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
