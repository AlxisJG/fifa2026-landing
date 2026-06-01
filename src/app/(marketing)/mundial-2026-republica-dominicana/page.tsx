import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("mundial2026Rd");

export default function Mundial2026RdPage() {
  return (
    <MarketingPageMain>
      <PageIntro config={PAGE_SEO.mundial2026Rd} kicker="Mundial 2026" />
      <section className="section-shell pb-14">
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p>
            Desde República Dominicana, PIO Deportes centraliza la cobertura del Mundial FIFA 2026 con noticias,
            calendario, posiciones y acceso a partidos en vivo para suscriptores.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={PAGE_SEO.partidos.path} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight">
              Ver partidos
            </Link>
            <Link href={PAGE_SEO.posiciones.path} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800">
              Ver posiciones
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageMain>
  );
}
