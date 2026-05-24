import { apiFootballProvider } from "./api-football";
import { getFootballDataMode, isLiveFootballDataEnabled } from "./config";
import { mockProvider } from "./mock-provider";
import type { FootballProvider, ProviderResponse } from "./types";

function resolveProvider(): FootballProvider {
  return isLiveFootballDataEnabled() ? apiFootballProvider : mockProvider;
}

async function withFallback<T>(
  fn: (p: FootballProvider) => Promise<ProviderResponse<T>>,
  fallback: (m: FootballProvider) => Promise<ProviderResponse<T>>
) {
  const active = resolveProvider();

  if (active === mockProvider) {
    return fallback(mockProvider);
  }

  try {
    return await fn(apiFootballProvider);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown provider error";
    const demo = await fallback(mockProvider);
    return { ...demo, error: message, source: "demo" as const };
  }
}

export const footballDataProvider = {
  getTicker: () => withFallback((p) => p.getTicker(), (m) => m.getTicker()),
  getFixtures: () => withFallback((p) => p.getFixtures(), (m) => m.getFixtures()),
  getStandings: () => withFallback((p) => p.getStandings(), (m) => m.getStandings()),
  getFeaturedMatch: () => withFallback((p) => p.getFeaturedMatch(), (m) => m.getFeaturedMatch())
};

export { getFootballDataMode, isLiveFootballDataEnabled };
