import type { FeaturedMatch, Fixture, StandingsData, TickerItem } from "@/lib/football-api/types";

export type MatchCenter = FeaturedMatch;

function todayAt(hours: number, minutes = 0): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function tomorrowAt(hours: number, minutes = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function futureGroupStageAt(daysFromNow: number, hours: number, minutes = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

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
  homeCode: "MEX",
  awayCode: "RSA",
  homeName: "Mexico",
  awayName: "South Africa",
  groupLabel: "Grupo A — Fase de grupos",
  venue: "Mexico City Stadium",
  kickoff: "jue, 11 jun, 7:00 p. m.",
  kickoffAt: "2026-06-11T23:00:00.000Z"
};

export const fixtures: Fixture[] = [
  {
    id: "f1",
    home: "Argentina",
    away: "Brazil",
    kickoffLabel: "Today • 6:00 PM",
    startsAt: todayAt(18),
    phase: "Group Stage",
    live: true
  },
  {
    id: "f2",
    home: "USA",
    away: "Mexico",
    kickoffLabel: "Today • 8:00 PM",
    startsAt: todayAt(20),
    phase: "Group Stage"
  },
  {
    id: "f3",
    home: "Spain",
    away: "France",
    kickoffLabel: "Tomorrow • 7:00 PM",
    startsAt: tomorrowAt(19),
    phase: "Group Stage"
  },
  {
    id: "f4",
    home: "Portugal",
    away: "Germany",
    kickoffLabel: "Group Stage • 9:30 PM",
    startsAt: futureGroupStageAt(5, 21, 30),
    phase: "Group Stage"
  }
];

export const standings: StandingsData = {
  groups: [
    {
      group: "Grupo A",
      rows: [
        { position: 1, team: "USA", shortCode: "USA", played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 2, pts: 6, gd: "+3" },
        { position: 2, team: "Mexico", shortCode: "MEX", played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, pts: 4, gd: "+1" },
        { position: 3, team: "Canada", shortCode: "CAN", played: 2, won: 1, drawn: 0, lost: 1, gf: 2, ga: 2, pts: 3, gd: "0" },
        { position: 4, team: "Panama", shortCode: "PAN", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 5, pts: 1, gd: "-4" }
      ]
    },
    {
      group: "Grupo B",
      rows: [
        { position: 1, team: "Brasil", shortCode: "BRA", played: 2, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, pts: 7, gd: "+4" },
        { position: 2, team: "Croacia", shortCode: "CRO", played: 2, won: 1, drawn: 1, lost: 0, gf: 4, ga: 3, pts: 4, gd: "+1" },
        { position: 3, team: "Japón", shortCode: "JPN", played: 2, won: 1, drawn: 0, lost: 1, gf: 3, ga: 4, pts: 3, gd: "-1" },
        { position: 4, team: "Marruecos", shortCode: "MAR", played: 2, won: 0, drawn: 1, lost: 1, gf: 2, ga: 6, pts: 1, gd: "-4" }
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
