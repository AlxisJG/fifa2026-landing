export type TickerItem = {
  id: string;
  text: string;
  live?: boolean;
};

export type MatchCenter = {
  home: string;
  away: string;
  venue: string;
  stage: string;
  kickoff: string;
  sponsor: string;
};

export type Fixture = {
  id: string;
  home: string;
  away: string;
  kickoffLabel: string;
  stage: "Today" | "Tomorrow" | "Group Stage" | "Knockout";
  live?: boolean;
};

export const tickerItems: TickerItem[] = [
  { id: "t1", text: "ARG 2 - 1 BRA • LIVE 68'", live: true },
  { id: "t2", text: "USA vs MEX • Today 8:00 PM" },
  { id: "t3", text: "ESP vs FRA • Tomorrow" },
  { id: "t4", text: "DOM Coverage • Pio Deportes" }
];

export const featuredMatch: MatchCenter = {
  home: "USA",
  away: "Mexico",
  venue: "SoFi Stadium",
  stage: "Group Stage",
  kickoff: "8:00 PM AST",
  sponsor: "Match Center by Sponsor"
};

export const fixtures: Fixture[] = [
  { id: "f1", home: "Argentina", away: "Brazil", kickoffLabel: "Today • 6:00 PM", stage: "Today", live: true },
  { id: "f2", home: "USA", away: "Mexico", kickoffLabel: "Today • 8:00 PM", stage: "Today" },
  { id: "f3", home: "Spain", away: "France", kickoffLabel: "Tomorrow • 7:00 PM", stage: "Tomorrow" },
  { id: "f4", home: "Portugal", away: "Germany", kickoffLabel: "Group Stage • 9:30 PM", stage: "Group Stage" }
];

export const standings = {
  group: "Group A",
  rows: [
    { team: "USA", pts: 6, gd: "+3" },
    { team: "Mexico", pts: 4, gd: "+1" },
    { team: "Canada", pts: 3, gd: "0" },
    { team: "Panama", pts: 1, gd: "-4" }
  ]
};

export const adInventoryNotes = [
  "728x90 Leaderboard",
  "300x250 Companion",
  "336x280 Large Rectangle",
  "160x600 Side Rail",
  "300x50 Mobile Banner"
];

// Future API replacements:
// - tickerItems -> API-Football / Sportmonks live events endpoint
// - featuredMatch + fixtures -> Statorium/FIFA fixtures endpoint
// - standings -> group standings endpoint
// Map incoming API data into this exact structure to keep UI components stable.
