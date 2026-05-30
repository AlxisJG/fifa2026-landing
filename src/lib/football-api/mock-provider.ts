import { fixtures, featuredMatch, standings, tickerItems } from "@/data/worldcup-widgets";
import type { FootballProvider, ProviderResponse } from "./types";

const emptyTopscorers = { goals: [], assists: [], cards: [] };

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
  },
  async getSquads() {
    return { source: "demo", data: [] };
  },
  async getTopscorers() {
    return { source: "demo", data: emptyTopscorers };
  }
};
