import type { NextRequest } from "next/server";

const DEFAULT_ALLOWED_COUNTRIES = ["DO"];

const SEARCH_BOT_PATTERN =
  /googlebot|google-inspectiontool|bingbot|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot/i;

function parseAllowedCountries(): Set<string> {
  const raw = process.env.GEO_BLOCK_ALLOWED_COUNTRIES?.trim();
  const codes = raw
    ? raw.split(",").map((code) => code.trim().toUpperCase()).filter(Boolean)
    : DEFAULT_ALLOWED_COUNTRIES;
  return new Set(codes);
}

export function isGeoBlockEnabled(): boolean {
  return process.env.GEO_BLOCK_ENABLED === "true";
}

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
}

export function shouldBypassGeoBlock(request: NextRequest): boolean {
  if (!isGeoBlockEnabled()) return true;
  if (process.env.NODE_ENV === "development") return true;
  if (isLocalHostname(request.nextUrl.hostname)) return true;

  if (process.env.GEO_BLOCK_ALLOW_SEARCH_BOTS === "true") {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (SEARCH_BOT_PATTERN.test(userAgent)) return true;
  }

  return false;
}

export function resolveRequestCountry(request: NextRequest): string | null {
  const fromHeader = request.headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  if (fromHeader) return fromHeader;

  // Vercel Edge may attach geo on the request object at runtime (not in NextRequest types).
  const geoCountry = (request as NextRequest & { geo?: { country?: string } }).geo?.country
    ?.trim()
    .toUpperCase();
  return geoCountry || null;
}

export function isCountryAllowed(country: string | null): boolean {
  if (!country) return false;
  return parseAllowedCountries().has(country);
}

export function geoBlockedHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Contenido no disponible en tu región | PIO Deportes</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #090f1f;
        color: #fff;
      }
      .card {
        max-width: 32rem;
        width: 100%;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 1.25rem;
        background: rgba(255,255,255,0.04);
        padding: 2rem 1.75rem;
        text-align: center;
      }
      .badge {
        display: inline-block;
        margin-bottom: 1rem;
        border-radius: 999px;
        background: rgba(215,25,32,0.18);
        color: #ffb4b4;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        padding: 0.45rem 0.85rem;
        text-transform: uppercase;
      }
      h1 {
        font-size: clamp(1.35rem, 4vw, 1.85rem);
        line-height: 1.15;
        margin-bottom: 0.85rem;
      }
      p {
        color: rgba(255,255,255,0.72);
        line-height: 1.6;
        font-size: 0.98rem;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="badge">Acceso restringido</div>
      <h1>La transmisión en vivo solo está disponible en República Dominicana</h1>
      <p>
        Por restricciones de distribución, el stream del Mundial FIFA 2026 en PIO Deportes solo
        puede verse desde República Dominicana.
      </p>
    </main>
  </body>
</html>`;
}
