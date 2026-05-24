import { getFootballApiConfig, isLiveFootballDataEnabled } from "./config";
import { formatStandingsGroupEs } from "./formatters";
import {
  mapApiFixtureToFeaturedMatch,
  mapApiFixtureToFixture,
  mapApiFixtureToTickerItem
} from "./mappers";
import type { FootballProvider, ProviderResponse, StandingsData, TickerItem, Fixture, FeaturedMatch } from "./types";

function assertLiveProvider() {
  if (!isLiveFootballDataEnabled()) {
    throw new Error("Real provider disabled or missing API_FOOTBALL_KEY / API_FOOTBALL_WORLD_CUP_LEAGUE_ID.");
  }
}

async function apiFetch(path: string) {
  const { host, key } = getFootballApiConfig();
  if (!key) throw new Error("Missing API_FOOTBALL_KEY");

  const res = await fetch(`https://${host}${path}`, {
    headers: { "x-apisports-key": key },
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error(`API-Football error ${res.status}`);
  return res.json();
}

export const apiFootballProvider: FootballProvider = {
  async getTicker(): Promise<ProviderResponse<TickerItem[]>> {
    assertLiveProvider();
    const { leagueId, season } = getFootballApiConfig();
    const json = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&next=4`);
    const data = (json.response ?? []).map(mapApiFixtureToTickerItem);
    return { source: "live", data };
  },

  async getFixtures(): Promise<ProviderResponse<Fixture[]>> {
    assertLiveProvider();
    const { leagueId, season } = getFootballApiConfig();
    const json = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&next=12`);
    const data = (json.response ?? []).map(mapApiFixtureToFixture);
    return { source: "live", data };
  },

  async getStandings(): Promise<ProviderResponse<StandingsData>> {
    assertLiveProvider();
    const { leagueId, season } = getFootballApiConfig();
    const json = await apiFetch(`/standings?league=${leagueId}&season=${season}`);
    const league = json.response?.[0]?.league;
    const groupLabel = formatStandingsGroupEs(league?.standings?.[0]?.[0]?.group);
    const rows = (league?.standings?.[0] ?? []).slice(0, 4).map((row: { team?: { name?: string }; points?: number; goalsDiff?: number }) => ({
      team: row.team?.name ?? "Equipo",
      pts: row.points ?? 0,
      gd: `${(row.goalsDiff ?? 0) > 0 ? "+" : ""}${row.goalsDiff ?? 0}`
    }));
    return { source: "live", data: { group: groupLabel, rows } };
  },

  async getFeaturedMatch(): Promise<ProviderResponse<FeaturedMatch>> {
    assertLiveProvider();
    const { leagueId, season } = getFootballApiConfig();

    const liveJson = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&live=all`);
    const liveMatch = liveJson.response?.[0];
    if (liveMatch) {
      return { source: "live", data: mapApiFixtureToFeaturedMatch(liveMatch) };
    }

    const nextJson = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&next=1`);
    const nextMatch = nextJson.response?.[0];
    if (!nextMatch) throw new Error("No featured match data.");

    return { source: "live", data: mapApiFixtureToFeaturedMatch(nextMatch) };
  }
};
