import { NextResponse } from "next/server";
import { getFootballDataStatus } from "@/lib/football-api/config";
import { getFootballLiveSectionsGateStatus } from "@/lib/football-live-sections-gate";
import { inspectSportmonksPlaceholders } from "@/lib/football-api/sportmonks-inspect";

export async function GET() {
  const status = getFootballDataStatus();
  const liveSections = getFootballLiveSectionsGateStatus();
  const sportmonks = status.mode === "live" ? await inspectSportmonksPlaceholders() : null;

  return NextResponse.json({
    ...status,
    dataSource:
      status.mode === "live"
        ? "sportmonks_api"
        : "local_mock_worldcup_widgets",
    liveSections,
    sportmonks
  });
}
