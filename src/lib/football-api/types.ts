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

export type FixturePhase = "Group Stage" | "Knockout";

export type Fixture = {
  id: string;
  home: string;
  away: string;
  kickoffLabel: string;
  /** ISO kickoff time for calendar-day filters (Hoy / Mañana). */
  startsAt: string;
  /** Competition phase — fase de grupos o eliminatorias. */
  phase: FixturePhase;
  live?: boolean;
  /** SportMonks fixture.placeholder — knockout TBD */
  isPlaceholder?: boolean;
  homePlaceholder?: boolean;
  awayPlaceholder?: boolean;
  groupLabel?: string;
  roundLabel?: string;
  venue?: string;
  matchLabel?: string;
  homeFlagUrl?: string;
  awayFlagUrl?: string;
  homeScore?: number;
  awayScore?: number;
};

export type FeaturedMatch = {
  homeCode: string;
  awayCode: string;
  homeName: string;
  awayName: string;
  groupLabel: string;
  venue: string;
  kickoff?: string;
  /** ISO kickoff instant (UTC) for countdown alignment. */
  kickoffAt?: string;
  homeFlagUrl?: string;
  awayFlagUrl?: string;
  isPlaceholder?: boolean;
  live?: boolean;
  homeScore?: number;
  awayScore?: number;
  /** Ej. "67'" o "HT" cuando el partido está en curso. */
  liveDetail?: string;
};

export type StandingsRow = {
  position: number;
  team: string;
  shortCode?: string;
  flagUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
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
  /** Posición en español (Portero, Defensa, …). */
  position?: string;
  jerseyNumber?: number;
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
