"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface GoogleAnalyticsPageViewProps {
  measurementId?: string;
  googleAdsId?: string;
}

/**
 * Sends page_path on App Router navigations after the initial load (handled by `gtag('config', …)`).
 * Keeps GA4 and Google Ads web-traffic / remarketing in sync on client-side route changes.
 */
export function GoogleAnalyticsPageView({
  measurementId,
  googleAdsId
}: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window.gtag !== "function") {
      return;
    }

    const search = searchParams.toString();
    const pathWithQuery = `${pathname}${search ? `?${search}` : ""}`;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const page = { page_path: pathWithQuery };

    if (measurementId) {
      window.gtag("config", measurementId, page);
    }
    if (googleAdsId) {
      window.gtag("config", googleAdsId, page);
    }
  }, [pathname, searchParams, measurementId, googleAdsId]);

  return null;
}
