import { getLiveFootballBundle, sportmonksProvider } from "./sportmonks-provider";
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

export const footballDataProvider = {
  getTicker: () => withFallback((p) => p.getTicker(), (m) => m.getTicker(), []),
  getFixtures: () => withFallback((p) => p.getFixtures(), (m) => m.getFixtures(), []),
  getStandings: () =>
    withFallback((p) => p.getStandings(), (m) => m.getStandings(), { groups: [] }),
  getFeaturedMatch: () =>
    withFallback((p) => p.getFeaturedMatch(), (m) => m.getFeaturedMatch(), emptyFeaturedMatch),
  getLiveFootball: () =>
    withFallback(
      () => getLiveFootballBundle(),
      async (m) => {
        const [ticker, match] = await Promise.all([m.getTicker(), m.getFeaturedMatch()]);
        return {
          source: ticker.source,
          data: { ticker: ticker.data, match: match.data }
        };
      },
      { ticker: [], match: emptyFeaturedMatch }
    ),
  getSquads: () => withFallback((p) => p.getSquads(), (m) => m.getSquads(), []),
  getTopscorers: () =>
    withFallback((p) => p.getTopscorers(), (m) => m.getTopscorers(), emptyTopscorers)
};

export { getFootballDataMode, isLiveFootballDataEnabled };
