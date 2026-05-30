"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getMetaPixelId } from "@/lib/meta-pixel";

/** Fires PageView on client-side navigations (initial load is handled by the base pixel script). */
export function MetaPixelPageView() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const pixelId = getMetaPixelId();

  useEffect(() => {
    if (!pixelId || typeof window.fbq !== "function") {
      return;
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq("track", "PageView");
  }, [pathname, pixelId]);

  return null;
}
