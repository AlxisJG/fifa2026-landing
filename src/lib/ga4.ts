/** GA4 Measurement ID (format `G-XXXXXXXXXX`) from env. */
export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id || !/^G-[A-Z0-9]+$/i.test(id)) {
    return undefined;
  }
  return id;
}

/** Send a GA4 recommended event (`event` API). Client-only — no-op on server / before gtag loads. */
export function gaEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params ?? {});
}
