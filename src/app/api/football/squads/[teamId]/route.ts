import { NextResponse } from "next/server";
import { isLiveFootballDataEnabled } from "@/lib/football-api/config";
import { mapSportmonksSquadPlayers } from "@/lib/football-api/mappers";
import { fetchSquadByTeamId } from "@/lib/football-api/sportmonks-client";

type RouteParams = { params: Promise<{ teamId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { teamId: teamIdRaw } = await params;
  const teamId = Number(teamIdRaw);

  if (!Number.isFinite(teamId) || teamId <= 0) {
    return NextResponse.json({ source: "live", data: [], error: "Invalid team id" }, { status: 400 });
  }

  if (!isLiveFootballDataEnabled()) {
    return NextResponse.json({ source: "demo", data: [] });
  }

  try {
    const entries = await fetchSquadByTeamId(teamId);
    const data = mapSportmonksSquadPlayers(entries);
    return NextResponse.json({ source: "live", data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load squad";
    return NextResponse.json({ source: "live", data: [], error: message }, { status: 502 });
  }
}
