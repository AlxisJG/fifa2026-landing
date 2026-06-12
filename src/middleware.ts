import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  geoBlockedHtml,
  isCountryAllowed,
  resolveRequestCountry,
  shouldBypassGeoBlock
} from "@/lib/geo-block";

export function middleware(request: NextRequest) {
  if (shouldBypassGeoBlock(request)) {
    return NextResponse.next();
  }

  const country = resolveRequestCountry(request);
  if (isCountryAllowed(country)) {
    return NextResponse.next();
  }

  return new NextResponse(geoBlockedHtml(), {
    status: 451,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

/** Rutas con geoblock: transmisión en vivo y su API de estado. */
export const GEO_BLOCK_PATHS = ["/transmision", "/api/stream"] as const;

export const config = {
  matcher: ["/transmision", "/transmision/:path*", "/api/stream/:path*"]
};
