export type DataSource = "live" | "demo";

export type TickerItem = {
  id: string;
  text: string;
  live?: boolean;
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
  home: string;
  away: string;
  venue: string;
  stage: string;
  kickoff: string;
  sponsor: string;
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
