import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export const metadata = buildPageMetadata("dondeVerMundial");

export default function DondeVerMundialPage() {
  const funnelEnabled = isSubscriptionFunnelEnabled();
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.dondeVerMundial} kicker="Transmisión" />
      <PageContentAds page="dondeVerMundial">
      <section className="section-shell pb-14">
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p>
            Regístrate gratis en PIO Deportes para ver el Mundial 2026 en vivo con anuncios, o elige un plan premium
            para disfrutar la transmisión sin interrupciones publicitarias.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {funnelEnabled ? (
              <>
                <Link href="/suscribete" className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight">
                  Suscríbete gratis
                </Link>
                <Link href="/planes" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800">
                  Ver planes premium
                </Link>
              </>
            ) : (
              <Link href={PAGE_SEO.partidos.path} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight">
                Ver calendario de partidos
              </Link>
            )}
          </div>
        </div>
      </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
