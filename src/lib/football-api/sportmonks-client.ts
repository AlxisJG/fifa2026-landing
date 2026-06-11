import { parseSportmonksStartingAt } from "@/lib/football-api/datetime";
import { getSportmonksConfig, isLiveFootballDataEnabled } from "./config";
import type {
  SportmonksFixture,
  SportmonksListResponse,
  SportmonksScheduleStage,
  SportmonksSquadEntry,
  SportmonksStanding,
  SportmonksTeam,
  SportmonksTopscorer,
  SportmonksVenue
} from "./sportmonks-types";

export const FIXTURE_INCLUDES = "participants;scores;state;venue;round;stage;group";
export const STANDINGS_INCLUDES = "participant;details.type;group";
/**
 * Schedule by season returns nested fixtures + participants without extra includes
 * (SportMonks allows 0 nested includes on this endpoint).
 */
export const SCHEDULE_INCLUDES = undefined;
export const TOPSCORERS_INCLUDES = "type;player;participant";
export const SQUAD_INCLUDES = "player;position";

/** Next.js fetch revalidate (seconds) per endpoint class. */
export const CACHE_REVALIDATE = {
  livescores: 20,
  schedule: 300,
  standings: 300,
  between: 120,
  teams: 600,
  topscorers: 300
} as const;

type FetchOptions = {
  include?: string;
  filters?: string;
  revalidate?: number;
};

function assertLiveProvider() {
  if (!isLiveFootballDataEnabled()) {
    throw new Error("Real provider disabled or missing SPORTMONKS_API_TOKEN / SPORTMONKS_SEASON_ID.");
  }
}

function buildUrl(path: string, options: FetchOptions = {}) {
  const { baseUrl, token } = getSportmonksConfig();
  if (!token) throw new Error("Missing SPORTMONKS_API_TOKEN");

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);
  url.searchParams.set("api_token", token);
  if (options.include) url.searchParams.set("include", options.include);
  if (options.filters) url.searchParams.set("filters", options.filters);
  return url.toString();
}

export async function sportmonksFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  assertLiveProvider();

  const res = await fetch(buildUrl(path, options), {
    next: { revalidate: options.revalidate ?? 60 }
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SportMonks error ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}`);
  }

  return res.json() as Promise<T>;
}

export function getSeasonId(): string {
  const { seasonId } = getSportmonksConfig();
  if (!seasonId) throw new Error("Missing SPORTMONKS_SEASON_ID");
  return seasonId;
}

export function formatDateYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function fetchLivescores(): Promise<SportmonksFixture[]> {
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksFixture>>("/livescores", {
    include: FIXTURE_INCLUDES,
    revalidate: CACHE_REVALIDATE.livescores
  });
  return json.data ?? [];
}

export async function fetchFixturesBetween(start: Date, end: Date, limit?: number): Promise<SportmonksFixture[]> {
  const seasonId = getSeasonId();
  const startStr = formatDateYmd(start);
  const endStr = formatDateYmd(end);

  const json = await sportmonksFetch<SportmonksListResponse<SportmonksFixture>>(
    `/fixtures/between/${startStr}/${endStr}`,
    {
      include: FIXTURE_INCLUDES,
      filters: `fixtureSeasons:${seasonId}`,
      revalidate: CACHE_REVALIDATE.between
    }
  );

  const fixtures = (json.data ?? []).slice().sort((a, b) => kickoffMs(a) - kickoffMs(b));

  return limit ? fixtures.slice(0, limit) : fixtures;
}

function kickoffMs(fixture: SportmonksFixture): number {
  return parseSportmonksStartingAt(fixture.starting_at).getTime();
}

export async function fetchUpcomingFixtures(limit: number): Promise<SportmonksFixture[]> {
  const now = Date.now();
  const fixtures = await fetchFixturesBetween(new Date(), addDays(new Date(), 60));
  return fixtures.filter((f) => kickoffMs(f) >= now).slice(0, limit);
}

export async function fetchStandingsBySeason(): Promise<SportmonksStanding[]> {
  const seasonId = getSeasonId();
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksStanding>>(
    `/standings/seasons/${seasonId}`,
    { include: STANDINGS_INCLUDES, revalidate: CACHE_REVALIDATE.standings }
  );
  return json.data ?? [];
}

export function buildGroupNameMap(standings: SportmonksStanding[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const row of standings) {
    if (row.group_id && row.group?.name) {
      map.set(row.group_id, row.group.name);
    }
  }
  return map;
}

export async function fetchVenuesBySeason(): Promise<Map<number, SportmonksVenue>> {
  const seasonId = getSeasonId();
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksVenue>>(
    `/venues/seasons/${seasonId}`,
    { revalidate: CACHE_REVALIDATE.teams }
  );
  const map = new Map<number, SportmonksVenue>();
  for (const venue of json.data ?? []) {
    if (venue.id) map.set(venue.id, venue);
  }
  return map;
}

function enrichScheduleFixture(
  fixture: SportmonksFixture,
  context: {
    stage?: SportmonksScheduleStage;
    roundName?: string;
    roundId?: number;
    groupNamesById?: Map<number, string>;
    venuesById?: Map<number, SportmonksVenue>;
  }
): SportmonksFixture {
  const groupId = fixture.group_id;
  const groupName = groupId ? context.groupNamesById?.get(groupId) : undefined;
  const venue = fixture.venue_id ? context.venuesById?.get(fixture.venue_id) : undefined;

  return {
    ...fixture,
    stage: fixture.stage ?? (context.stage?.name ? { name: context.stage.name } : undefined),
    round:
      fixture.round ??
      (context.roundName
        ? { id: context.roundId, name: context.roundName, stage_id: context.stage?.id }
        : undefined),
    group:
      fixture.group ??
      (groupId && groupName ? { id: groupId, name: groupName, stage_id: context.stage?.id } : undefined),
    venue: fixture.venue ?? venue
  };
}

/** Flatten fixtures from GET /schedules/seasons/{id} (stages → rounds → fixtures). */
export function flattenScheduleFixtures(
  stages: SportmonksScheduleStage[],
  options?: {
    groupNamesById?: Map<number, string>;
    venuesById?: Map<number, SportmonksVenue>;
  }
): SportmonksFixture[] {
  const out: SportmonksFixture[] = [];

  for (const stage of stages) {
    for (const round of stage.rounds ?? []) {
      for (const fixture of round.fixtures ?? []) {
        out.push(
          enrichScheduleFixture(fixture, {
            stage,
            roundName: round.name,
            roundId: round.id,
            groupNamesById: options?.groupNamesById,
            venuesById: options?.venuesById
          })
        );
      }
    }

    for (const fixture of stage.fixtures ?? []) {
      out.push(
        enrichScheduleFixture(fixture, {
          stage,
          groupNamesById: options?.groupNamesById,
          venuesById: options?.venuesById
        })
      );
    }
  }

  return out.sort((a, b) => kickoffMs(a) - kickoffMs(b));
}

export async function fetchScheduleFixtures(
  limit?: number,
  options?: { includeAllDates?: boolean }
): Promise<SportmonksFixture[]> {
  const seasonId = getSeasonId();
  try {
    const [json, standings, venuesById] = await Promise.all([
      sportmonksFetch<SportmonksListResponse<SportmonksScheduleStage>>(
        `/schedules/seasons/${seasonId}`,
        {
          ...(SCHEDULE_INCLUDES ? { include: SCHEDULE_INCLUDES } : {}),
          revalidate: CACHE_REVALIDATE.schedule
        }
      ),
      fetchStandingsBySeason(),
      fetchVenuesBySeason()
    ]);

    const groupNamesById = buildGroupNameMap(standings);
    const flat = flattenScheduleFixtures(json.data ?? [], { groupNamesById, venuesById });

    if (flat.length > 0) {
      const pool = options?.includeAllDates
        ? flat
        : (() => {
            const now = Date.now();
            const upcoming = flat.filter((f) => kickoffMs(f) >= now);
            return upcoming.length > 0 ? upcoming : flat;
          })();
      return limit ? pool.slice(0, limit) : pool;
    }
  } catch {
    // Fall back to between dates
  }
  return fetchUpcomingFixtures(limit ?? 12);
}

export async function fetchTeamsBySeason(): Promise<SportmonksTeam[]> {
  const seasonId = getSeasonId();
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksTeam>>(
    `/teams/seasons/${seasonId}`,
    { revalidate: CACHE_REVALIDATE.teams }
  );
  return json.data ?? [];
}

export async function fetchSquadByTeamId(teamId: number): Promise<SportmonksSquadEntry[]> {
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksSquadEntry>>(
    `/squads/teams/${teamId}`,
    { include: SQUAD_INCLUDES, revalidate: CACHE_REVALIDATE.teams }
  );
  return json.data ?? [];
}

export async function fetchTopscorersBySeason(): Promise<SportmonksTopscorer[]> {
  const seasonId = getSeasonId();
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksTopscorer>>(
    `/topscorers/seasons/${seasonId}`,
    { include: TOPSCORERS_INCLUDES, revalidate: CACHE_REVALIDATE.topscorers }
  );
  return json.data ?? [];
}
