"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProfileForm } from "@/components/auth/profile-form";
import { usePlan } from "@/hooks/use-plan";
import { FREE_PLAN_LABEL } from "@/lib/plan-config";

const tabs = [
  { id: "plan", label: "Plan actual" },
  { id: "billing", label: "Historial de cobros" },
  { id: "account", label: "Datos de la cuenta" }
] as const;

type TabId = (typeof tabs)[number]["id"];

function BillingHistoryPanel() {
  return (
    <div className="glass-heavy rounded-2xl border border-white/10 p-6">
      <p className="text-sm text-white/60">
        Tu historial de cobros aparecerá aquí cuando completes compras del plan premium. Por ahora no hay pagos
        registrados.
      </p>
    </div>
  );
}

function PlanPanel() {
  const { plan } = usePlan();

  return (
    <div className="glass-heavy space-y-4 rounded-2xl border border-white/10 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Plan activo</p>
        <p className="mt-2 text-2xl font-semibold text-white">{plan?.name ?? FREE_PLAN_LABEL}</p>
        <p className="mt-2 text-sm text-white/60">
          {plan?.adFree
            ? "Transmisión premium sin anuncios."
            : "Plan gratis con anuncios durante la transmisión en vivo."}
        </p>
      </div>
      {!plan?.adFree && (
        <Link
          href="/planes"
          className="inline-flex rounded-full bg-electric px-5 py-2.5 text-sm font-semibold text-midnight transition hover:brightness-110"
        >
          Mejorar a premium
        </Link>
      )}
    </div>
  );
}

export function ProfileTabs() {
  const searchParams = useSearchParams();
  const active = (searchParams.get("tab") as TabId) || "plan";

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/perfil?tab=${tab.id}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              active === tab.id
                ? "bg-electric text-midnight"
                : "border border-white/15 text-white/70 hover:border-white/30 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {active === "billing" && <BillingHistoryPanel />}
      {active === "plan" && <PlanPanel />}
      {active === "account" && <ProfileForm />}
    </div>
  );
}
