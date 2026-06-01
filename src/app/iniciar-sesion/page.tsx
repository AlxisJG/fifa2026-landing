import { redirect } from "next/navigation";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export default function LoginPage() {
  redirect(isSubscriptionFunnelEnabled() ? "/suscribete" : "/");
}
