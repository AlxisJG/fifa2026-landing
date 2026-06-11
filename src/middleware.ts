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

export const config = {
  matcher: [
    /*
     * Apply to all routes except static assets needed for basic rendering.
     * API routes and pages are blocked for non-DO visitors.
     */
    "/((?!_next/static|_next/image|favicon.ico|recursos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)"
  ]
};
