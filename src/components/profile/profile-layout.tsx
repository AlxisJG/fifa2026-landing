"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDING } from "@/lib/branding";
import { useAuth } from "@/hooks/use-auth";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export function ProfileLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const funnelEnabled = isSubscriptionFunnelEnabled();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#060d1f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(70,210,255,0.15),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(231,190,98,0.08),transparent_35%)]" />
      <header className="relative z-10 border-b border-white/10 bg-[#08142c]/80 backdrop-blur-xl">
        <div className="section-shell flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src={BRANDING.pioIcon} alt="Pio Deportes" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="hidden text-[11px] uppercase tracking-[0.2em] text-white/70 sm:inline">Mi perfil</span>
          </Link>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em]">
            {funnelEnabled && (
              <Link href="/transmision" className="text-white/70 transition hover:text-white">
                Transmisión
              </Link>
            )}
            <button type="button" onClick={logout} className="text-white/70 transition hover:text-white">
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="relative z-10 flex flex-1 items-start justify-center px-4 py-10 sm:py-14">{children}</main>
    </div>
  );
}
