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
  /** SportMonks fixture.placeholder — knockout TBD */
  isPlaceholder?: boolean;
  homePlaceholder?: boolean;
  awayPlaceholder?: boolean;
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
  isPlaceholder?: boolean;
};

export type StandingsRow = {
  team: string;
  pts: number;
  gd: string;
  isPlaceholder?: boolean;
};

export type StandingsGroup = {
  group: string;
  rows: StandingsRow[];
};

export type StandingsData = {
  groups: StandingsGroup[];
};

export type SquadPlayer = {
  id: number;
  name: string;
  position?: string;
};

export type SquadTeam = {
  id: number;
  name: string;
  shortCode?: string;
  flagUrl?: string;
  placeholder?: boolean;
  players: SquadPlayer[];
};

export type TopscorerEntry = {
  playerName: string;
  teamName?: string;
  value: number;
  typeLabel: string;
};

export type TopscorersData = {
  goals: TopscorerEntry[];
  assists: TopscorerEntry[];
  cards: TopscorerEntry[];
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
  getSquads(): Promise<ProviderResponse<SquadTeam[]>>;
  getTopscorers(): Promise<ProviderResponse<TopscorersData>>;
}
