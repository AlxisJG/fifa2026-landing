import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("partidosEnVivoMundial");

export default function PartidosEnVivoMundialPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.partidosEnVivoMundial} kicker="En vivo" />
      <PageContentAds page="partidosEnVivoMundial">
        <section className="section-shell pb-14">
          <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Sigue los partidos en vivo del Mundial 2026 con marcadores actualizados y acceso directo a la
              transmisión en PIO Deportes.
            </p>
            <Link
              href="/transmision"
              className="inline-flex rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight"
            >
              Ver transmisión en vivo
            </Link>
          </div>
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
