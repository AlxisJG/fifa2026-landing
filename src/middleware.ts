import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSubscriptionFunnelEnabled, isSubscriptionFunnelPath } from "@/lib/subscription-funnel-gate";

export function middleware(request: NextRequest) {
  if (isSubscriptionFunnelEnabled()) {
    return NextResponse.next();
  }

  if (isSubscriptionFunnelPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/suscribete", "/suscribete/:path*", "/transmision", "/transmision/:path*"]
};
