import { getFeaturedEvent } from "@/lib/platform/active-event";

const DEFAULT_WEB_APP_URL = "https://fifa.piodeportes.com";

export const PIO_APP_CONFIG = {
  brandName: "PIO Deportes",
  bundleId: "com.piodeportes.app",
  deepLinkScheme: "piodeportes",
  webAppUrl: process.env.NEXT_PUBLIC_APP_WEB_URL?.trim() || DEFAULT_WEB_APP_URL,
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || "",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() || ""
} as const;

export function getAppDownloadUtm(eventId?: string): string {
  const campaign = eventId ?? getFeaturedEvent().acquisition.utmCampaign;
  return `utm_source=web&utm_medium=banner&utm_campaign=${campaign}`;
}

export function getAppStoreUrlWithUtm(eventId?: string): string | null {
  const base = PIO_APP_CONFIG.appStoreUrl;
  if (!base) return null;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${getAppDownloadUtm(eventId)}`;
}

export function getPlayStoreUrlWithUtm(eventId?: string): string | null {
  const base = PIO_APP_CONFIG.playStoreUrl;
  if (!base) return null;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${getAppDownloadUtm(eventId)}`;
}
