/** Google Ads conversion ID (format `AW-XXXXXXXXX`) from env. */
export function getGoogleAdsId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  if (!id || !/^AW-\d+$/i.test(id)) {
    return undefined;
  }
  return id;
}

/**
 * Fire a Google Ads conversion event. Client-only.
 * @param sendTo Full send_to value, e.g. `AW-967165184/AbCdEfGhIj`
 */
export function googleAdsConversion(
  sendTo: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "conversion", { send_to: sendTo, ...params });
}
