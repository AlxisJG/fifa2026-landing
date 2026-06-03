"use client";

import { SuscribeteMarketing } from "@/components/sections/suscribete-marketing";
import { CombinedAuthForm } from "@/components/auth/combined-auth-form";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";

export default function SuscribetePage() {
  return (
    <MarketingPageMain>
      <PageContentAds page="suscribete">
      <SuscribeteMarketing />
      <section id="registro" className="relative overflow-hidden bg-[#060d1f] py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(70,210,255,0.10),transparent_45%),radial-gradient(circle_at_80%_100%,rgba(231,190,98,0.06),transparent_35%)]" />
        <div className="ambient-particles absolute inset-0 opacity-30" />
        <div className="ambient-scanlines absolute inset-0 opacity-[0.04]" />
        <div className="section-shell relative">
          <CombinedAuthForm />
        </div>
      </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
