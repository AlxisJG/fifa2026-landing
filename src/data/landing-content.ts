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

/** Fallback cuando WordPress no está disponible o la categoría no tiene imágenes. */
export const gallery = [
  {
    src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&h=800&q=80",
    alt: "Partido de fútbol bajo luces del estadio",
    width: 1200,
    height: 800
  },
  {
    src: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1200&h=1800&q=80",
    alt: "Aficionados celebrando un gol en las gradas",
    width: 1200,
    height: 1800
  },
  {
    src: "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&w=1200&h=1200&q=80",
    alt: "Balón de fútbol en el césped del campo",
    width: 1200,
    height: 1200
  },
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&h=900&q=80",
    alt: "Jugador regateando con el balón en el partido",
    width: 1200,
    height: 900
  },
  {
    src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&h=1600&q=80",
    alt: "Vista aérea de un estadio lleno de público",
    width: 1200,
    height: 1600
  },
  {
    src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&h=750&q=80",
    alt: "Afición con banderas en un partido internacional",
    width: 1200,
    height: 750
  },
  {
    src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&h=1500&q=80",
    alt: "Celebración de equipo tras marcar un gol",
    width: 1200,
    height: 1500
  },
  {
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&h=800&q=80",
    alt: "Atleta corriendo en pista dentro del estadio",
    width: 1200,
    height: 800
  },
  {
    src: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&h=1200&q=80",
    alt: "Cameraman cubriendo un evento deportivo",
    width: 1200,
    height: 1200
  },
  {
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a9?auto=format&fit=crop&w=1200&h=1700&q=80",
    alt: "Grada con aficionados vestidos de colores",
    width: 1200,
    height: 1700
  },
  {
    src: "https://images.unsplash.com/photo-1551958219-acbc608c2177?auto=format&fit=crop&w=1200&h=900&q=80",
    alt: "Jugadores disputando el balón en el centro del campo",
    width: 1200,
    height: 900
  },
  {
    src: "https://images.unsplash.com/photo-1489944440615-453fc83eb32a?auto=format&fit=crop&w=1200&h=1400&q=80",
    alt: "Estadio iluminado antes del inicio del partido",
    width: 1200,
    height: 1400
  }
];

export type MatchSummary = {
  id: string;
  title: string;
  duration: string;
  image: string;
};

export const matchSummaries: MatchSummary[] = [
  {
    id: "s1",
    title: "USA 2 - 1 Mexico: resumen completo",
    duration: "8:42",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s2",
    title: "Argentina vs Brazil: mejores jugadas",
    duration: "6:15",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s3",
    title: "Spain vs France: goles del partido",
    duration: "5:30",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s4",
    title: "Semifinal: momentos clave en 4K",
    duration: "12:08",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1400&q=80"
  }
];
