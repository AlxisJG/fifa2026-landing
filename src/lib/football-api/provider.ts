import { apiFootballProvider, shouldUseRealFootballData } from "./api-football";
import { mockProvider } from "./mock-provider";
import type { FootballProvider, ProviderResponse } from "./types";

const provider: FootballProvider = shouldUseRealFootballData() ? apiFootballProvider : mockProvider;

async function withFallback<T>(fn: (p: FootballProvider) => Promise<ProviderResponse<T>>, fallback: (m: FootballProvider) => Promise<ProviderResponse<T>>) {
  try {
    return await fn(provider);
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
