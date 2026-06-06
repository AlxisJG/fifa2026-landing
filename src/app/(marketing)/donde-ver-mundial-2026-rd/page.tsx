import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("dondeVerMundial");

export default function DondeVerMundialPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.dondeVerMundial} kicker="Transmisión" />
      <PageContentAds page="dondeVerMundial">
        <section className="section-shell pb-14">
          <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Mira el Mundial 2026 en vivo en PIO Deportes desde cualquier dispositivo. Accede a la transmisión
              principal, el calendario de partidos y toda la cobertura del torneo.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/transmision" className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight">
                Ver transmisión en vivo
              </Link>
              <Link href={PAGE_SEO.partidos.path} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800">
                Ver calendario de partidos
              </Link>
            </div>
          </div>
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
