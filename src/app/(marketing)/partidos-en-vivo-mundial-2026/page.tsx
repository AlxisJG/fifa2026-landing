import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { SeoContentSections, SeoFaqSection } from "@/components/seo/seo-content-sections";
import { SeoLandingLayout } from "@/components/seo/seo-landing-layout";
import { EN_VIVO_FAQ, EN_VIVO_SECTIONS } from "@/data/seo-landing-content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("partidosEnVivoMundial");

const config = PAGE_SEO.partidosEnVivoMundial;

export default function PartidosEnVivoMundialPage() {
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
        faqs={EN_VIVO_FAQ}
      >
        <PageIntro config={config} kicker="En vivo" />
        <PageContentAds page="partidosEnVivoMundial">
          <section className="section-shell pb-14">
            <SeoContentSections sections={EN_VIVO_SECTIONS} />
            <SeoFaqSection faqs={EN_VIVO_FAQ} />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={PAGE_SEO.partidos.path}
                className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight"
              >
                Ver calendario completo
              </Link>
              <Link
                href={PAGE_SEO.dondeVerMundial.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Dónde ver el Mundial en RD
              </Link>
              <Link
                href={PAGE_SEO.posiciones.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Ver posiciones
              </Link>
            </div>
          </section>
        </PageContentAds>
      </SeoLandingLayout>
    </MarketingPageMain>
  );
}
