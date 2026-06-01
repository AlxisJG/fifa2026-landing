import { hasStreamAccess } from "@/lib/plan-storage";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export type LiveDestination = "/" | "/suscribete" | "/transmision";

export function getLiveDestination(isAuthenticated: boolean): LiveDestination {
  if (!isSubscriptionFunnelEnabled()) return "/";
  if (!isAuthenticated) return "/suscribete";
  if (!hasStreamAccess()) return "/suscribete";
  return "/transmision";
}
