import { redirect } from "next/navigation";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export default function RegisterPage() {
  redirect(isSubscriptionFunnelEnabled() ? "/suscribete" : "/");
}
