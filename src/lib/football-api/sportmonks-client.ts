import { getSportmonksConfig, isLiveFootballDataEnabled } from "./config";
import type {
  SportmonksFixture,
  SportmonksListResponse,
  SportmonksSchedule,
  SportmonksStanding,
  SportmonksTeam,
  SportmonksTopscorer
} from "./sportmonks-types";

export const FIXTURE_INCLUDES = "participants;scores;state;venue;round;stage;group";
export const STANDINGS_INCLUDES = "participant;details.type;group";
/**
 * Schedule by season returns nested fixtures + participants without extra includes
 * (SportMonks allows 0 nested includes on this endpoint).
 */
export const SCHEDULE_INCLUDES = undefined;
export const TOPSCORERS_INCLUDES = "type;player;participant";

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

  const fixtures = (json.data ?? []).slice().sort((a, b) => {
    const ta = new Date(a.starting_at ?? 0).getTime();
    const tb = new Date(b.starting_at ?? 0).getTime();
    return ta - tb;
  });

  return limit ? fixtures.slice(0, limit) : fixtures;
}

export async function fetchUpcomingFixtures(limit: number): Promise<SportmonksFixture[]> {
  const now = new Date();
  const fixtures = await fetchFixturesBetween(now, addDays(now, 60));
  return fixtures.filter((f) => new Date(f.starting_at ?? 0) >= now).slice(0, limit);
}

export async function fetchStandingsBySeason(): Promise<SportmonksStanding[]> {
  const seasonId = getSeasonId();
  const json = await sportmonksFetch<SportmonksListResponse<SportmonksStanding>>(
    `/standings/seasons/${seasonId}`,
    { include: STANDINGS_INCLUDES, revalidate: CACHE_REVALIDATE.standings }
  );
  return json.data ?? [];
}

/** Flatten fixtures from GET /schedules/seasons/{id} (WC 2026 guide). */
export function flattenScheduleFixtures(schedules: SportmonksSchedule[]): SportmonksFixture[] {
  const out: SportmonksFixture[] = [];
  for (const schedule of schedules) {
    for (const round of schedule.rounds ?? []) {
      if (round.fixtures?.length) out.push(...round.fixtures);
    }
    for (const stage of schedule.stages ?? []) {
      if (stage.fixtures?.length) out.push(...stage.fixtures);
    }
  }
  return out.sort((a, b) => new Date(a.starting_at ?? 0).getTime() - new Date(b.starting_at ?? 0).getTime());
}

export async function fetchScheduleFixtures(
  limit?: number,
  options?: { includeAllDates?: boolean }
): Promise<SportmonksFixture[]> {
  const seasonId = getSeasonId();
  try {
    const json = await sportmonksFetch<SportmonksListResponse<SportmonksSchedule>>(
      `/schedules/seasons/${seasonId}`,
      {
        ...(SCHEDULE_INCLUDES ? { include: SCHEDULE_INCLUDES } : {}),
        revalidate: CACHE_REVALIDATE.schedule
      }
    );
    const flat = flattenScheduleFixtures(json.data ?? []);
    if (flat.length > 0) {
      const pool = options?.includeAllDates
        ? flat
        : (() => {
            const now = Date.now();
            const upcoming = flat.filter((f) => new Date(f.starting_at ?? 0).getTime() >= now);
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
    { include: "players", revalidate: CACHE_REVALIDATE.teams }
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
