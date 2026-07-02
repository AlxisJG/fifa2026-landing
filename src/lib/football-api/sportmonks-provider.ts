import {
  addDays,
  fetchFixturesBetween,
  fetchLivescores,
  fetchScheduleFixtures,
  fetchStandingsBySeason,
  fetchTeamsBySeason,
  fetchTopscorersBySeason
} from "./sportmonks-client";
import { mergeSportmonksFixtures } from "./merge-fixtures";
import {
  isSportmonksFixtureLive,
  mapSportmonksFixtureToFeaturedMatch,
  mapSportmonksFixtureToFixture,
  mapSportmonksFixtureToTickerItem,
  mapSportmonksStandings,
  mapSportmonksTeams,
  mapSportmonksTopscorers
} from "./mappers";
import type {
  FootballProvider,
  ProviderResponse,
  FeaturedMatch,
  Fixture,
  LiveFootballBundle,
  SquadTeam,
  StandingsData,
  TickerItem,
  TopscorersData
} from "./types";
import type { SportmonksFixture } from "./sportmonks-types";

const FIXTURES_LIMIT = 100;

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

function fixtureHasPlaceholder(fixture: SportmonksFixture): boolean {
  if (fixture.placeholder) return true;
  return (fixture.participants ?? []).some((p) => p.placeholder);
}

/** In production, drop TBD / placeholder rows from SportMonks. */
function filterProductionFixtures(fixtures: SportmonksFixture[]): SportmonksFixture[] {
  if (!isProductionRuntime()) return fixtures;
  return fixtures.filter((f) => !fixtureHasPlaceholder(f));
}

function uniqueFixturesById(fixtures: SportmonksFixture[]): SportmonksFixture[] {
  const seen = new Set<number>();
  return fixtures.filter((f) => {
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
}

async function buildTickerFixtures(liveInput?: SportmonksFixture[]): Promise<SportmonksFixture[]> {
  const live = liveInput ?? filterProductionFixtures(await fetchLivescores());
  const merged = uniqueFixturesById(live);

  if (merged.length >= 4) {
    return merged.slice(0, 4);
  }

  const now = new Date();
  const upcoming = filterProductionFixtures(await fetchFixturesBetween(now, addDays(now, 14), 8));
  const nonLiveUpcoming = upcoming.filter((f) => !isSportmonksFixtureLive(f));

  return uniqueFixturesById([...merged, ...nonLiveUpcoming]).slice(0, 4);
}

async function resolveFeaturedFixture(liveInput?: SportmonksFixture[]): Promise<SportmonksFixture | undefined> {
  const live = liveInput ?? filterProductionFixtures(await fetchLivescores());
  if (live[0]) return live[0];

  const fromSchedule = filterProductionFixtures(await fetchScheduleFixtures(12));
  return fromSchedule[0];
}

export async function getLiveFootballBundle(): Promise<ProviderResponse<LiveFootballBundle>> {
  const live = filterProductionFixtures(await fetchLivescores());
  const [tickerFixtures, featuredFixture] = await Promise.all([
    buildTickerFixtures(live),
    resolveFeaturedFixture(live)
  ]);

  if (!featuredFixture) {
    throw new Error("No featured match data from SportMonks.");
  }

  return {
    source: "live",
    data: {
      ticker: tickerFixtures.map(mapSportmonksFixtureToTickerItem),
      match: mapSportmonksFixtureToFeaturedMatch(featuredFixture)
    }
  };
}

export const sportmonksProvider: FootballProvider = {
  async getTicker(): Promise<ProviderResponse<TickerItem[]>> {
    const fixtures = await buildTickerFixtures();
    const data = fixtures.map(mapSportmonksFixtureToTickerItem);
    return { source: "live", data };
  },

  async getFixtures(): Promise<ProviderResponse<Fixture[]>> {
    const now = new Date();
    const [schedule, livescores, recent] = await Promise.all([
      fetchScheduleFixtures(FIXTURES_LIMIT, { includeAllDates: true }),
      fetchLivescores().catch(() => [] as SportmonksFixture[]),
      fetchFixturesBetween(addDays(now, -7), addDays(now, 1), 80).catch(() => [] as SportmonksFixture[])
    ]);

    const fixtures = filterProductionFixtures(
      mergeSportmonksFixtures(schedule, [...livescores, ...recent])
    );
    let data = fixtures.map(mapSportmonksFixtureToFixture);
    if (process.env.SPORTMONKS_PRIORITIZE_PLACEHOLDERS === "true") {
      data = data.slice().sort((a, b) => Number(b.isPlaceholder) - Number(a.isPlaceholder));
    }
    return { source: "live", data };
  },

  async getStandings(): Promise<ProviderResponse<StandingsData>> {
    const standings = await fetchStandingsBySeason();
    let data = mapSportmonksStandings(standings);
    if (isProductionRuntime()) {
      data = {
        groups: data.groups
          .map((g) => ({ ...g, rows: g.rows.filter((r) => !r.isPlaceholder) }))
          .filter((g) => g.rows.length > 0)
      };
    }
    return { source: "live", data };
  },

  async getFeaturedMatch(): Promise<ProviderResponse<FeaturedMatch>> {
    const match = await resolveFeaturedFixture();
    if (!match) throw new Error("No featured match data from SportMonks.");
    return { source: "live", data: mapSportmonksFixtureToFeaturedMatch(match) };
  },

  async getSquads(): Promise<ProviderResponse<SquadTeam[]>> {
    const teams = await fetchTeamsBySeason();
    const data = mapSportmonksTeams(teams);
    return { source: "live", data };
  },

  async getTopscorers(): Promise<ProviderResponse<TopscorersData>> {
    const rows = await fetchTopscorersBySeason();
    const data = mapSportmonksTopscorers(rows);
    return { source: "live", data };
  }
};
