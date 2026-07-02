"use client";

import type { ReactNode } from "react";
import type { PageSeoConfig } from "@/lib/seo/pages";

type PageIntroProps = {
  config: Pick<PageSeoConfig, "h1" | "intro">;
  kicker?: string;
};

export function PageIntro({ config, kicker }: PageIntroProps) {
  return (
    <section className="section-shell py-10 sm:py-14">
      {kicker && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-electric/90">{kicker}</p>
      )}
      <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
        {config.h1}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{config.intro}</p>
    </section>
  );
}

type MarketingPageShellProps = {
  children: ReactNode;
};

export function MarketingPageMain({ children }: MarketingPageShellProps) {
  return (
    <div className="marketing-page-main relative overflow-x-hidden pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] sm:pt-[calc(env(safe-area-inset-top,0px)+4.75rem)]">
      {children}
    </div>
  );
}
