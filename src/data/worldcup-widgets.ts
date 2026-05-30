import type { FeaturedMatch, StandingsData, TickerItem } from "@/lib/football-api/types";

export type MatchCenter = FeaturedMatch;

export type Fixture = {
  id: string;
  home: string;
  away: string;
  kickoffLabel: string;
  stage: "Today" | "Tomorrow" | "Group Stage" | "Knockout";
  live?: boolean;
};

export const tickerItems: TickerItem[] = [
  {
    id: "t1",
    homeCode: "ARG",
    awayCode: "BRA",
    homeLabel: "ARG",
    awayLabel: "BRA",
    homeScore: 2,
    awayScore: 1,
    detail: "EN VIVO 68'",
    live: true
  },
  {
    id: "t2",
    homeCode: "USA",
    awayCode: "MEX",
    homeLabel: "USA",
    awayLabel: "MEX",
    detail: "Hoy 8:00 PM"
  },
  {
    id: "t3",
    homeCode: "ESP",
    awayCode: "FRA",
    homeLabel: "ESP",
    awayLabel: "FRA",
    detail: "Mañana"
  },
  {
    id: "t4",
    homeCode: "POR",
    awayCode: "GER",
    homeLabel: "POR",
    awayLabel: "GER",
    detail: "Sáb 9:30 PM"
  }
];

export const featuredMatch: FeaturedMatch = {
  homeCode: "CAN",
  awayCode: "BIH",
  homeName: "Canadá",
  awayName: "Bosnia y Herzegovina",
  groupLabel: "Grupo B — Fase de grupos",
  venue: "Estadio BC Place, Vancouver",
  kickoff: "8:00 PM AST"
};

export const fixtures: Fixture[] = [
  { id: "f1", home: "Argentina", away: "Brazil", kickoffLabel: "Today • 6:00 PM", stage: "Today", live: true },
  { id: "f2", home: "USA", away: "Mexico", kickoffLabel: "Today • 8:00 PM", stage: "Today" },
  { id: "f3", home: "Spain", away: "France", kickoffLabel: "Tomorrow • 7:00 PM", stage: "Tomorrow" },
  { id: "f4", home: "Portugal", away: "Germany", kickoffLabel: "Group Stage • 9:30 PM", stage: "Group Stage" }
];

export const standings: StandingsData = {
  groups: [
    {
      group: "Grupo A",
      rows: [
        { team: "USA", pts: 6, gd: "+3" },
        { team: "Mexico", pts: 4, gd: "+1" },
        { team: "Canada", pts: 3, gd: "0" },
        { team: "Panama", pts: 1, gd: "-4" }
      ]
    },
    {
      group: "Grupo B",
      rows: [
        { team: "Brasil", pts: 7, gd: "+4" },
        { team: "Croacia", pts: 4, gd: "+1" },
        { team: "Japón", pts: 3, gd: "-1" },
        { team: "Marruecos", pts: 1, gd: "-4" }
      ]
    }
  ]
};

export const adInventoryNotes = [
  "728x90 Leaderboard",
  "300x250 Companion",
  "336x280 Large Rectangle",
  "160x600 Side Rail",
  "300x50 Mobile Banner"
];

// Live data: SportMonks via src/lib/football-api/sportmonks-provider.ts (USE_REAL_FOOTBALL_DATA=true)
// Demo fallback: datos estáticos de este archivo
// Map incoming API data into this exact structure to keep UI components stable.
