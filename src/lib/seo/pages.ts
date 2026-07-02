import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/seo/site";
import { buildSocialMetadata } from "@/lib/seo/metadata-shared";

export type PageSeoKey =
  | "noticias"
  | "partidos"
  | "posiciones"
  | "highlights"
  | "galeria"
  | "mundial2026Rd"
  | "dondeVerMundial"
  | "partidosEnVivoMundial";

export type PageSeoConfig = {
  path: string;
  showInNav: boolean;
  navLabel?: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
};

export const PAGE_SEO: Record<PageSeoKey, PageSeoConfig> = {
  noticias: {
    path: "/noticias",
    showInNav: true,
    navLabel: "Noticias",
    title: "Noticias FIFA y Mundial 2026 | Pio Deportes",
    description:
      "Noticias FIFA, novedades del Mundial 2026 y cobertura deportiva internacional en PIO Deportes República Dominicana.",
    h1: "Noticias de FIFA",
    intro:
      "Sigue las noticias FIFA más relevantes del Mundial 2026, análisis de selecciones y la actualidad del futbol internacional en PIO Deportes."
  },
  partidos: {
    path: "/partidos",
    showInNav: true,
    navLabel: "Partidos",
    title: "Partidos y Calendario Mundial FIFA 2026 | Pio Deportes",
    description:
      "Calendario de partidos del Mundial FIFA 2026, horarios, sedes y fixtures del torneo en PIO Deportes.",
    h1: "Partidos y horarios del Mundial 2026",
    intro:
      "Consulta el calendario de partidos del Mundial FIFA 2026 con horarios, sedes y la programación completa del torneo."
  },
  posiciones: {
    path: "/posiciones",
    showInNav: true,
    navLabel: "Estadísticas",
    title: "Tabla de Posiciones Mundial FIFA 2026 | Pio Deportes",
    description:
      "Tablas de posiciones, estadísticas de equipos y jugadores destacados del Mundial FIFA 2026.",
    h1: "Equipos, jugadores y estadísticas",
    intro:
      "Revisa tablas de posiciones, rendimiento de equipos, jugadores destacados y estadísticas del futbol mundial en el Mundial 2026."
  },
  highlights: {
    path: "/highlights",
    showInNav: true,
    navLabel: "Highlights",
    title: "Highlights y Resúmenes Mundial 2026 | Pio Deportes",
    description: "Resúmenes de partidos, mejores jugadas y highlights del Mundial FIFA 2026.",
    h1: "Resúmenes de los partidos",
    intro: "Revive los mejores momentos del Mundial 2026 con resúmenes en video y highlights de cada encuentro."
  },
  galeria: {
    path: "/galeria",
    showInNav: true,
    navLabel: "Galería",
    title: "Galería FIFA World Cup 2026 | Pio Deportes",
    description: "Galería multimedia inmersiva del Mundial FIFA 2026 en PIO Deportes.",
    h1: "Galería inmersiva FIFA 2026",
    intro: "Explora imágenes destacadas y contenido visual del Mundial FIFA 2026."
  },
  mundial2026Rd: {
    path: "/mundial-2026-republica-dominicana",
    showInNav: false,
    title: "Mundial FIFA 2026 en República Dominicana | Pio Deportes",
    description:
      "Todo sobre el Mundial FIFA 2026 en República Dominicana: partidos, noticias, estadísticas y cobertura en PIO Deportes.",
    h1: "Mundial FIFA 2026 en República Dominicana",
    intro:
      "PIO Deportes es tu portal para seguir el Mundial FIFA 2026 desde República Dominicana con noticias, calendario, posiciones y transmisión en vivo."
  },
  dondeVerMundial: {
    path: "/donde-ver-mundial-2026-rd",
    showInNav: false,
    title: "Dónde ver el Mundial 2026 en RD | Pio Deportes",
    description:
      "Descubre dónde ver el Mundial FIFA 2026 en República Dominicana con PIO Deportes: transmisión en vivo, calendario y cobertura completa.",
    h1: "Dónde ver el Mundial 2026 en República Dominicana",
    intro:
      "En PIO Deportes puedes seguir el Mundial 2026 en vivo online desde cualquier dispositivo. Consulta calendario, marcadores y cobertura completa del torneo en República Dominicana."
  },
  partidosEnVivoMundial: {
    path: "/partidos-en-vivo-mundial-2026",
    showInNav: false,
    title: "Partidos en Vivo Mundial FIFA 2026 | Pio Deportes",
    description:
      "Partidos en vivo del Mundial FIFA 2026, marcadores en tiempo real y transmisión online en PIO Deportes.",
    h1: "Partidos en vivo del Mundial FIFA 2026",
    intro:
      "Sigue los partidos en vivo del Mundial 2026 con marcadores actualizados y acceso a la transmisión en PIO Deportes."
  }
};

export const NAV_PAGES = (Object.entries(PAGE_SEO) as [PageSeoKey, PageSeoConfig][])
  .filter(([, config]) => config.showInNav)
  .map(([key, config]) => ({ key, ...config }));

export const SEO_FOOTER_PAGES = (Object.entries(PAGE_SEO) as [PageSeoKey, PageSeoConfig][])
  .filter(([, config]) => !config.showInNav)
  .map(([key, config]) => ({ key, ...config }));

export function buildPageMetadata(key: PageSeoKey): Metadata {
  const page = PAGE_SEO[key];
  const canonical = absoluteSiteUrl(page.path);

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    ...buildSocialMetadata({
      title: page.title,
      description: page.description,
      path: page.path,
      imageAlt: page.h1
    }),
    robots: { index: true, follow: true }
  };
}

export function buildNoIndexMetadata(title: string, description?: string): Metadata {
  return {
    title: { absolute: title },
    ...(description ? { description } : {}),
    robots: { index: false, follow: false }
  };
}

export function getPagePath(key: PageSeoKey): string {
  return PAGE_SEO[key].path;
}
