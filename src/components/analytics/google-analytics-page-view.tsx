"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface GoogleAnalyticsPageViewProps {
  measurementId: string;
}

/**
 * Sends `page_view` on App Router navigations after the initial load (handled by `gtag('config', …)`).
 * @see https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag#get_started
 */
export function GoogleAnalyticsPageView({ measurementId }: GoogleAnalyticsPageViewProps) {
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

    window.gtag("config", measurementId, {
      page_path: pathWithQuery,
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}
