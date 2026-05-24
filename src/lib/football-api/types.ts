export type DataSource = "live" | "demo";

export type TickerItem = {
  id: string;
  homeCode: string;
  awayCode: string;
  homeLabel: string;
  awayLabel: string;
  homeScore?: number;
  awayScore?: number;
  detail: string;
  live?: boolean;
  homeFlagUrl?: string;
  awayFlagUrl?: string;
};

export type Fixture = {
  id: string;
  home: string;
  away: string;
  kickoffLabel: string;
  stage: "Today" | "Tomorrow" | "Group Stage" | "Knockout";
  live?: boolean;
};

export type FeaturedMatch = {
  homeCode: string;
  awayCode: string;
  homeName: string;
  awayName: string;
  groupLabel: string;
  venue: string;
  kickoff?: string;
  homeFlagUrl?: string;
  awayFlagUrl?: string;
};

export type StandingsRow = {
  team: string;
  pts: number;
  gd: string;
};

export type StandingsData = {
  group: string;
  rows: StandingsRow[];
};

export type ProviderResponse<T> = {
  source: DataSource;
  data: T;
  error?: string;
};

export interface FootballProvider {
  getTicker(): Promise<ProviderResponse<TickerItem[]>>;
  getFixtures(): Promise<ProviderResponse<Fixture[]>>;
  getStandings(): Promise<ProviderResponse<StandingsData>>;
  getFeaturedMatch(): Promise<ProviderResponse<FeaturedMatch>>;
}
