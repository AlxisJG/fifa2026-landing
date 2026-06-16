import { unstable_cache } from "next/cache";
import { getLiveFootballBundle, sportmonksProvider } from "./sportmonks-provider";
import { CACHE_REVALIDATE } from "./sportmonks-client";
import { getFootballDataMode, isLiveFootballDataEnabled } from "./config";
import { mockProvider } from "./mock-provider";
import type { FootballProvider, ProviderResponse } from "./types";

function resolveProvider(): FootballProvider {
  return isLiveFootballDataEnabled() ? sportmonksProvider : mockProvider;
}

async function withFallback<T>(
  fn: (p: FootballProvider) => Promise<ProviderResponse<T>>,
  fallback: (m: FootballProvider) => Promise<ProviderResponse<T>>,
  empty: T
) {
  const active = resolveProvider();

  if (active === mockProvider) {
    if (process.env.NODE_ENV === "production") {
      return { source: "live" as const, data: empty };
    }
    return fallback(mockProvider);
  }

  try {
    return await fn(sportmonksProvider);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown provider error";
    if (process.env.NODE_ENV === "production") {
      return { source: "live" as const, data: empty, error: message };
    }
    const demo = await fallback(mockProvider);
    return { ...demo, error: message, source: "demo" as const };
  }
}

const emptyTopscorers = { goals: [], assists: [], cards: [] };

const emptyFeaturedMatch = {
  homeCode: "",
  awayCode: "",
  homeName: "",
  awayName: "",
  groupLabel: "",
  venue: ""
};

const getCachedLiveFootballBundle = unstable_cache(
  getLiveFootballBundle,
  ["football-live-bundle"],
  { revalidate: 300 }
);

const getCachedStandings = unstable_cache(
  () => sportmonksProvider.getStandings(),
  ["football-standings"],
  { revalidate: CACHE_REVALIDATE.standings }
);

const getCachedSquads = unstable_cache(
  () => sportmonksProvider.getSquads(),
  ["football-squads"],
  { revalidate: CACHE_REVALIDATE.teams }
);

const getCachedTopscorers = unstable_cache(
  () => sportmonksProvider.getTopscorers(),
  ["football-topscorers"],
  { revalidate: CACHE_REVALIDATE.topscorers }
);

export const footballDataProvider = {
  getTicker: () => withFallback((p) => p.getTicker(), (m) => m.getTicker(), []),
  getFixtures: () => withFallback((p) => p.getFixtures(), (m) => m.getFixtures(), []),
  getStandings: () =>
    withFallback(() => getCachedStandings(), (m) => m.getStandings(), { groups: [] }),
  getFeaturedMatch: () =>
    withFallback((p) => p.getFeaturedMatch(), (m) => m.getFeaturedMatch(), emptyFeaturedMatch),
  getLiveFootball: () =>
    withFallback(
      () => getCachedLiveFootballBundle(),
      async (m) => {
        const [ticker, match] = await Promise.all([m.getTicker(), m.getFeaturedMatch()]);
        return {
          source: ticker.source,
          data: { ticker: ticker.data, match: match.data }
        };
      },
      { ticker: [], match: emptyFeaturedMatch }
    ),
  getSquads: () => withFallback(() => getCachedSquads(), (m) => m.getSquads(), []),
  getTopscorers: () =>
    withFallback(() => getCachedTopscorers(), (m) => m.getTopscorers(), emptyTopscorers)
};

export { getFootballDataMode, isLiveFootballDataEnabled };
