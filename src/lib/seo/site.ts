/** Canonical site origin — strips trailing slashes and invalid paths from env. */
export function getNormalizedSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://fifa.piodeportes.com";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://fifa.piodeportes.com";
  }
}

export const SITE_URL = getNormalizedSiteUrl();

export const SITE_NAME = "PIO Deportes RD";

export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION ?? "7sAuRPcvupNqrIvNYcL-Bph8S19y7Tm_k_zU8umGkxA";

/** Default Open Graph / Twitter preview (1200×630 recommended; logo used as fallback). */
export const DEFAULT_OG_IMAGE = "/LOGOS/logo-pio-fifa.png";

export const HOME_SEO = {
  title: "Mundial FIFA 2026 en República Dominicana | Pio Deportes",
  description:
    "PIO Deportes: noticias de FIFA, futbol en vivo, resultados, ligas internacionales, partidos, jugadores y toda la información deportiva en República Dominicana.",
  h1: "PIO Deportes - FIFA y Futbol en Vivo",
  introParagraphs: [
    "Bienvenido a PIO Deportes, tu portal para disfrutar el Mundial FIFA 2026 y toda la emoción del futbol internacional en vivo. Sigue noticias FIFA, resultados futbol en tiempo real, análisis de partidos, estadísticas, jugadores destacados y deportes online de las principales competiciones del mundo.",
    "En PIO Deportes podrás ver el Mundial de Futbol 2026 en vivo a través de nuestra plataforma, con acceso rápido para ver futbol online, partidos en vivo y transmisiones deportivas estables con CDN deportiva. Disfruta FIFA en vivo, cada partido FIFA online y la mejor experiencia para ver mundial en vivo o el Mundial online desde cualquier dispositivo."
  ] as const
};

export function absoluteSiteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).href;
}
