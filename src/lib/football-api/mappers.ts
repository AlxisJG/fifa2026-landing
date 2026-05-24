import type { FeaturedMatch, Fixture, TickerItem } from "./types";
import {
  formatKickoffEs,
  formatRoundLabelEs,
  formatVenueEs,
  resolveFixtureStage
} from "./formatters";

type ApiFixture = {
  fixture?: {
    id?: number;
    date?: string;
    status?: { short?: string; elapsed?: number };
    venue?: { name?: string; city?: string };
  };
  league?: { round?: string };
  teams?: {
    home?: { name?: string; code?: string; logo?: string };
    away?: { name?: string; code?: string; logo?: string };
  };
  goals?: { home?: number | null; away?: number | null };
};

function teamCode(team?: { name?: string; code?: string }, fallback = "LOC"): string {
  return team?.code ?? team?.name?.slice(0, 3)?.toUpperCase() ?? fallback;
}

function isLiveStatus(status?: string): boolean {
  return status === "1H" || status === "2H" || status === "HT" || status === "ET" || status === "P";
}

export function mapApiFixtureToTickerItem(match: ApiFixture): TickerItem {
  const homeCode = teamCode(match.teams?.home, "LOC");
  const awayCode = teamCode(match.teams?.away, "VIS");
  const live = isLiveStatus(match.fixture?.status?.short);
  const elapsed = match.fixture?.status?.elapsed ? ` ${match.fixture.status.elapsed}'` : "";
  const hasScore = match.goals?.home != null && match.goals?.away != null;

  return {
    id: String(match.fixture?.id ?? `${homeCode}-${awayCode}`),
    homeCode,
    awayCode,
    homeLabel: homeCode,
    awayLabel: awayCode,
    homeScore: hasScore ? match.goals!.home! : undefined,
    awayScore: hasScore ? match.goals!.away! : undefined,
    detail: live ? `EN VIVO${elapsed}` : formatKickoffEs(match.fixture?.date ?? new Date().toISOString()),
    live,
    homeFlagUrl: match.teams?.home?.logo ?? undefined,
    awayFlagUrl: match.teams?.away?.logo ?? undefined
  };
}

export function mapApiFixtureToFixture(match: ApiFixture): Fixture {
  const date = new Date(match.fixture?.date ?? Date.now());
  return {
    id: String(match.fixture?.id ?? `${match.teams?.home?.name}-${match.teams?.away?.name}`),
    home: match.teams?.home?.name ?? "Local",
    away: match.teams?.away?.name ?? "Visitante",
    kickoffLabel: formatKickoffEs(match.fixture?.date ?? date.toISOString()),
    stage: resolveFixtureStage(match.league?.round, date),
    live: isLiveStatus(match.fixture?.status?.short)
  };
}

export function mapApiFixtureToFeaturedMatch(match: ApiFixture): FeaturedMatch {
  const homeCode = teamCode(match.teams?.home, "LOC");
  const awayCode = teamCode(match.teams?.away, "VIS");

  return {
    homeCode,
    awayCode,
    homeName: match.teams?.home?.name ?? "Local",
    awayName: match.teams?.away?.name ?? "Visitante",
    groupLabel: formatRoundLabelEs(match.league?.round),
    venue: formatVenueEs(match.fixture?.venue),
    kickoff: formatKickoffEs(match.fixture?.date ?? new Date().toISOString()),
    homeFlagUrl: match.teams?.home?.logo ?? undefined,
    awayFlagUrl: match.teams?.away?.logo ?? undefined
  };
}
