export const mundial2026Event = {
  id: "mundial-2026",
  name: "Mundial FIFA 2026",
  active: true,
  startsAt: "2026-06-11",
  endsAt: "2026-07-19",
  branding: {
    logo: "/LOGOS/tournaments_fifa-world-cup-2026_700x700.football-logos.cc.png",
    kicker: "Mundial 2026"
  },
  featuredRoutes: ["/transmision", "/partidos", "/posiciones"],
  acquisition: {
    bannerCopy: "Descarga PIO Deportes — Vive el Mundial en vivo",
    utmCampaign: "wc2026_app"
  }
} as const;

export type PlatformEvent = typeof mundial2026Event;
