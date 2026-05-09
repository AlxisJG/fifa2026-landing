export type Match = {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  kickoff: string;
  venue: string;
  live?: boolean;
};

export const sponsors = [
  { name: "Banco Caribe", tier: "Platinum" },
  { name: "Presidente", tier: "Platinum" },
  { name: "Claro", tier: "Gold" },
  { name: "Banreservas", tier: "Gold" },
  { name: "Gatorade", tier: "Official Partner" },
  { name: "Arajet", tier: "Official Partner" }
];

export const fixtures: Match[] = [
  {
    id: "m1",
    home: "Argentina",
    away: "Brazil",
    homeFlag: "AR",
    awayFlag: "BR",
    kickoff: "2026-06-18T21:00:00-04:00",
    venue: "MetLife Stadium"
  },
  {
    id: "m2",
    home: "Spain",
    away: "France",
    homeFlag: "ES",
    awayFlag: "FR",
    kickoff: "2026-06-19T18:00:00-04:00",
    venue: "AT&T Stadium"
  },
  {
    id: "m3",
    home: "USA",
    away: "Mexico",
    homeFlag: "US",
    awayFlag: "MX",
    kickoff: "2026-06-19T22:30:00-04:00",
    venue: "SoFi Stadium",
    live: true
  }
];

export const news = [
  {
    title: "Dominican studio reveals World Cup 2026 premium coverage lineup",
    category: "Broadcast",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Top tactical battles to watch in opening week",
    category: "Analysis",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Behind the scenes: Production truck and virtual graphics",
    category: "Production",
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Best goals and saves from qualifiers",
    category: "Highlights",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80"
  }
];

export const gallery = [
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1543357480-c60d40007a3f?auto=format&fit=crop&w=1200&q=80"
];
