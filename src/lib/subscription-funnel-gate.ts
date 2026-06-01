/** Rutas del funnel de suscripción / en vivo (deshabilitables en producción vía env). */
export const SUBSCRIPTION_FUNNEL_PATHS = ["/suscribete", "/transmision"] as const;

export type SubscriptionFunnelPath = (typeof SUBSCRIPTION_FUNNEL_PATHS)[number];

export function isSubscriptionFunnelEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_FUNNEL !== "true";
}

export function isSubscriptionFunnelPath(pathname: string): boolean {
  return SUBSCRIPTION_FUNNEL_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
