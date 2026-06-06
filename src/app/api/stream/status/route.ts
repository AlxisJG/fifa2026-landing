import { NextResponse } from "next/server";
import { getLiveTransmissionStatus } from "@/lib/live-transmission-status";

export async function GET() {
  const status = await getLiveTransmissionStatus();

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20"
    }
  });
}
