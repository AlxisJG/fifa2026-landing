import { NextResponse } from "next/server";
import { footballDataProvider } from "@/lib/football-api/provider";
import {
  buildMatchPollWindows,
  serializeMatchPollWindow
} from "@/lib/live-transmission-poll-schedule";

export const dynamic = "force-dynamic";

export async function GET() {
  const fixtures = await footballDataProvider.getFixtures();
  const windows = buildMatchPollWindows(fixtures.data).map(serializeMatchPollWindow);

  return NextResponse.json(
    { windows },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    }
  );
}
