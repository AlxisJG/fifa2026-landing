import { NextResponse } from "next/server";
import { getLiveTransmissionStatusFresh } from "@/lib/live-transmission-status";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const status = await getLiveTransmissionStatusFresh();

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
