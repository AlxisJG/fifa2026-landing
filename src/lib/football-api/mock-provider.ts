import { fixtures, featuredMatch, standings, tickerItems } from "@/data/worldcup-widgets";
import type { FootballProvider, ProviderResponse } from "./types";

export const mockProvider: FootballProvider = {
  async getTicker(): Promise<ProviderResponse<typeof tickerItems>> {
    return { source: "demo", data: tickerItems };
  },
  async getFixtures(): Promise<ProviderResponse<typeof fixtures>> {
    return { source: "demo", data: fixtures };
  },
  async getStandings(): Promise<ProviderResponse<typeof standings>> {
    return { source: "demo", data: standings };
  },
  async getFeaturedMatch(): Promise<ProviderResponse<typeof featuredMatch>> {
    return { source: "demo", data: featuredMatch };
  }
};
