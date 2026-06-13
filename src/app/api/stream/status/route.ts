import { NextResponse } from "next/server";
import { getLiveTransmissionStatus } from "@/lib/live-transmission-status";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getLiveTransmissionStatus();

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0, must-revalidate"
    }
  });
}
