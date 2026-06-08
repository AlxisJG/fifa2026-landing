import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { SeoContentSections, SeoFaqSection } from "@/components/seo/seo-content-sections";
import { SeoLandingLayout } from "@/components/seo/seo-landing-layout";
import { MUNDIAL_RD_FAQ, MUNDIAL_RD_SECTIONS } from "@/data/seo-landing-content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("mundial2026Rd");

const config = PAGE_SEO.mundial2026Rd;

export default function Mundial2026RdPage() {
  return (
    <MarketingPageMain>
      <SeoLandingLayout
        path={config.path}
        title={config.title}
        description={config.description}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: config.h1 }
        ]}
        faqs={MUNDIAL_RD_FAQ}
      >
        <PageIntro config={config} kicker="Mundial 2026" />
        <PageContentAds page="mundial2026Rd">
          <section className="section-shell pb-14">
            <SeoContentSections sections={MUNDIAL_RD_SECTIONS} />
            <SeoFaqSection faqs={MUNDIAL_RD_FAQ} />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={PAGE_SEO.partidos.path}
                className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight"
              >
                Ver calendario de partidos
              </Link>
              <Link
                href={PAGE_SEO.posiciones.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Ver posiciones
              </Link>
              <Link
                href={PAGE_SEO.noticias.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Leer noticias FIFA
              </Link>
              <Link
                href={PAGE_SEO.dondeVerMundial.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Dónde ver en vivo
              </Link>
            </div>
          </section>
        </PageContentAds>
      </SeoLandingLayout>
    </MarketingPageMain>
  );
}
