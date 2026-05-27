/** Meta (Facebook) Pixel ID from env. Only numeric IDs are accepted. */
export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (!id || !/^\d+$/.test(id)) {
    return undefined;
  }
  return id;
}

export type MetaStandardEvent =
  | "PageView"
  | "Lead"
  | "CompleteRegistration"
  | "Purchase"
  | "Subscribe"
  | "ViewContent"
  | "InitiateCheckout"
  | "AddToCart";

/** Track a standard Meta Pixel event (client-only). */
export function trackMetaPixel(
  event: MetaStandardEvent,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }
  if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}
