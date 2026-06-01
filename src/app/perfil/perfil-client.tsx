"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

function ProfileContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(isSubscriptionFunnelEnabled() ? "/suscribete" : "/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-sm text-white/50">Cargando...</p>;
  }

  if (!user) return null;

  return (
    <>
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Mi perfil</h1>
        <p className="mt-2 text-sm text-white/60">Administra tu plan, pagos y datos de cuenta.</p>
      </div>
      <ProfileTabs />
    </>
  );
}

export default function PerfilPage() {
  return (
    <ProfileLayout>
      <Suspense fallback={<p className="text-sm text-white/50">Cargando...</p>}>
        <ProfileContent />
      </Suspense>
    </ProfileLayout>
  );
}
