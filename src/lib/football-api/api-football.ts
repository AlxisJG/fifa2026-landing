import type { Fixture, FootballProvider, ProviderResponse, StandingsData, TickerItem, FeaturedMatch } from "./types";

const host = process.env.API_FOOTBALL_HOST ?? "v3.football.api-sports.io";
const key = process.env.API_FOOTBALL_KEY;
const leagueId = process.env.API_FOOTBALL_WORLD_CUP_LEAGUE_ID;
const season = process.env.API_FOOTBALL_SEASON ?? "2026";

function canUseRealProvider() {
  const enabled = process.env.NEXT_PUBLIC_USE_REAL_FOOTBALL_DATA === "true";
  return enabled && Boolean(key) && Boolean(leagueId);
}

async function apiFetch(path: string) {
  if (!key) throw new Error("Missing API_FOOTBALL_KEY");
  const res = await fetch(`https://${host}${path}`, {
    headers: {
      "x-apisports-key": key
    },
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error(`API-Football error ${res.status}`);
  return res.json();
}

function formatKickoff(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

function stageFromLeagueRound(round?: string): Fixture["stage"] {
  if (!round) return "Group Stage";
  const r = round.toLowerCase();
  if (r.includes("group")) return "Group Stage";
  if (r.includes("round") || r.includes("quarter") || r.includes("semi") || r.includes("final")) return "Knockout";
  return "Group Stage";
}

export const apiFootballProvider: FootballProvider = {
  async getTicker(): Promise<ProviderResponse<TickerItem[]>> {
    if (!canUseRealProvider()) throw new Error("Real provider disabled or missing league/season.");
    const json = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&next=4`);
    const data: TickerItem[] = (json.response ?? []).map((m: any) => {
      const home = m.teams?.home?.code ?? m.teams?.home?.name?.slice(0, 3)?.toUpperCase() ?? "HOME";
      const away = m.teams?.away?.code ?? m.teams?.away?.name?.slice(0, 3)?.toUpperCase() ?? "AWAY";
      const live = m.fixture?.status?.short === "1H" || m.fixture?.status?.short === "2H" || m.fixture?.status?.short === "HT";
      const elapsed = m.fixture?.status?.elapsed ? ` ${m.fixture.status.elapsed}'` : "";
      return {
        id: String(m.fixture?.id ?? `${home}-${away}`),
        text: live ? `${home} vs ${away} • LIVE${elapsed}` : `${home} vs ${away} • ${formatKickoff(m.fixture?.date)}`,
        live
      };
    });
    return { source: "live", data };
  },

  async getFixtures(): Promise<ProviderResponse<Fixture[]>> {
    if (!canUseRealProvider()) throw new Error("Real provider disabled or missing league/season.");
    const json = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&next=12`);
    const now = new Date();
    const data: Fixture[] = (json.response ?? []).map((m: any) => {
      const date = new Date(m.fixture?.date);
      let stage: Fixture["stage"] = stageFromLeagueRound(m.league?.round);
      const diffHrs = (date.getTime() - now.getTime()) / 3600000;
      if (diffHrs >= 0 && diffHrs < 24) stage = "Today";
      else if (diffHrs >= 24 && diffHrs < 48) stage = "Tomorrow";
      return {
        id: String(m.fixture?.id ?? `${m.teams?.home?.name}-${m.teams?.away?.name}`),
        home: m.teams?.home?.name ?? "Home",
        away: m.teams?.away?.name ?? "Away",
        kickoffLabel: formatKickoff(m.fixture?.date),
        stage,
        live: ["1H", "2H", "HT"].includes(m.fixture?.status?.short)
      };
    });
    return { source: "live", data };
  },

  async getStandings(): Promise<ProviderResponse<StandingsData>> {
    if (!canUseRealProvider()) throw new Error("Real provider disabled or missing league/season.");
    const json = await apiFetch(`/standings?league=${leagueId}&season=${season}`);
    const league = json.response?.[0]?.league;
    const groupLabel = league?.standings?.[0]?.[0]?.group ?? "Group A";
    const rows = (league?.standings?.[0] ?? []).slice(0, 4).map((row: any) => ({
      team: row.team?.name ?? "Team",
      pts: row.points ?? 0,
      gd: `${row.goalsDiff > 0 ? "+" : ""}${row.goalsDiff ?? 0}`
    }));
    return { source: "live", data: { group: groupLabel, rows } };
  },

  async getFeaturedMatch(): Promise<ProviderResponse<FeaturedMatch>> {
    if (!canUseRealProvider()) throw new Error("Real provider disabled or missing league/season.");
    const json = await apiFetch(`/fixtures?league=${leagueId}&season=${season}&next=1`);
    const match = json.response?.[0];
    if (!match) throw new Error("No featured match data.");
    return {
      source: "live",
      data: {
        home: match.teams?.home?.name ?? "Home",
        away: match.teams?.away?.name ?? "Away",
        venue: match.fixture?.venue?.name ?? "Venue",
        stage: match.league?.round ?? "Group Stage",
        kickoff: formatKickoff(match.fixture?.date),
        sponsor: "Match Center by Sponsor"
      }
    };
  }
};

export function shouldUseRealFootballData() {
  if (!leagueId) {
    console.warn("API_FOOTBALL_WORLD_CUP_LEAGUE_ID missing. Falling back to mock data.");
  }
  return canUseRealProvider();
}
