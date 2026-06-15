"use client";

import { useEffect, useState } from "react";
import { getFeaturedEvent } from "@/lib/platform/active-event";
import {
  getAppStoreUrlWithUtm,
  getPlayStoreUrlWithUtm,
  PIO_APP_CONFIG
} from "@/lib/platform/app-config";
import { isNativeApp } from "@/lib/native-app";

const DISMISS_KEY = "pio-app-download-banner-dismissed";

function detectMobilePlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

export function AppDownloadBanner() {
  const [visible, setVisible] = useState(false);
  const event = getFeaturedEvent();

  useEffect(() => {
    if (isNativeApp()) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const platform = detectMobilePlatform();
    if (platform === "other") return;

    const storeUrl =
      platform === "ios" ? getAppStoreUrlWithUtm(event.id) : getPlayStoreUrlWithUtm(event.id);

    if (!storeUrl) return;
    setVisible(true);
  }, [event.id]);

  if (!visible) return null;

  const platform = detectMobilePlatform();
  const storeUrl =
    platform === "ios"
      ? getAppStoreUrlWithUtm(event.id)
      : getPlayStoreUrlWithUtm(event.id);

  if (!storeUrl) return null;

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-sky-200/80 bg-slate-900/95 px-4 py-3 text-white backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label="Descargar aplicación PIO Deportes"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{PIO_APP_CONFIG.brandName}</p>
          <p className="text-xs text-slate-300 leading-snug">{event.acquisition.bannerCopy}</p>
        </div>
        <a
          href={storeUrl}
          className="shrink-0 rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white"
        >
          Descargar
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full p-1 text-slate-400 hover:text-white"
          aria-label="Cerrar banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
