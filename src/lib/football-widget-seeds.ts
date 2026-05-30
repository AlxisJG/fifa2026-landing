import {
  featuredMatch,
  fixtures,
  standings,
  tickerItems
} from "@/data/worldcup-widgets";
import type {
  FeaturedMatch,
  Fixture,
  SquadTeam,
  StandingsData,
  TickerItem,
  TopscorersData
} from "@/lib/football-api/types";

/** Mock seeds are only for local design preview — never as production fallback. */
export function isFootballDemoSeedAllowed(): boolean {
  return process.env.NODE_ENV === "development";
}

export const EMPTY_FIXTURES: Fixture[] = [];
export const EMPTY_TICKER: TickerItem[] = [];
export const EMPTY_STANDINGS: StandingsData = { groups: [] };
export const EMPTY_TOPSCORERS: TopscorersData = { goals: [], assists: [], cards: [] };
export const EMPTY_SQUADS: SquadTeam[] = [];
export const EMPTY_FEATURED_MATCH: FeaturedMatch = {
  homeCode: "",
  awayCode: "",
  homeName: "",
  awayName: "",
  groupLabel: "",
  venue: ""
};

export function getFixturesSeed(): Fixture[] {
  return isFootballDemoSeedAllowed() ? fixtures : EMPTY_FIXTURES;
}

export function getStandingsSeed(): StandingsData {
  return isFootballDemoSeedAllowed() ? standings : EMPTY_STANDINGS;
}

export function getTickerSeed(): TickerItem[] {
  return isFootballDemoSeedAllowed() ? tickerItems : EMPTY_TICKER;
}

export function getFeaturedMatchSeed(): FeaturedMatch {
  return isFootballDemoSeedAllowed() ? featuredMatch : EMPTY_FEATURED_MATCH;
}

export function getSquadsSeed(): SquadTeam[] {
  return EMPTY_SQUADS;
}

export function getTopscorersSeed(): TopscorersData {
  return EMPTY_TOPSCORERS;
}
