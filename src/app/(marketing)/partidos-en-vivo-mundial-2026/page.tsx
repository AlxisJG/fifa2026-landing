import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export const metadata = buildPageMetadata("partidosEnVivoMundial");

export default function PartidosEnVivoMundialPage() {
  const funnelEnabled = isSubscriptionFunnelEnabled();
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.partidosEnVivoMundial} kicker="En vivo" />
      <section className="section-shell pb-14">
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p>
            Accede a la transmisión completa del Mundial 2026 suscribiéndote en PIO Deportes. Plan gratis con anuncios o
            premium sin anuncios.
          </p>
          <Link
            href={funnelEnabled ? "/suscribete" : PAGE_SEO.partidos.path}
            className="inline-flex rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight"
          >
            {funnelEnabled ? "Ver transmisión en vivo" : "Ver calendario de partidos"}
          </Link>
        </div>
      </section>
    </MarketingPageMain>
  );
}
