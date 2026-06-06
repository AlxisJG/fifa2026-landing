import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLiveTransmissionStatus } from "@/lib/live-transmission-status";
import TransmisionPage from "./transmision-client";

export const metadata: Metadata = {
  title: "Transmisión en vivo | Pio Deportes",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function TransmisionRoute() {
  const status = await getLiveTransmissionStatus();

  if (!status.available) {
    redirect("/");
  }

  return <TransmisionPage />;
}
