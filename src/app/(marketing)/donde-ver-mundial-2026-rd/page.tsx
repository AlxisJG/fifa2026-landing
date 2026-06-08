import Link from "next/link";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { SeoContentSections, SeoFaqSection } from "@/components/seo/seo-content-sections";
import { SeoLandingLayout } from "@/components/seo/seo-landing-layout";
import { DONDE_VER_FAQ, DONDE_VER_SECTIONS } from "@/data/seo-landing-content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

export const metadata = buildPageMetadata("dondeVerMundial");

const config = PAGE_SEO.dondeVerMundial;

export default function DondeVerMundialPage() {
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
        faqs={DONDE_VER_FAQ}
      >
        <PageIntro config={config} kicker="Transmisión" />
        <PageContentAds page="dondeVerMundial">
          <section className="section-shell pb-14">
            <SeoContentSections sections={DONDE_VER_SECTIONS} />
            <SeoFaqSection faqs={DONDE_VER_FAQ} />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={PAGE_SEO.partidosEnVivoMundial.path}
                className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight"
              >
                Partidos en vivo
              </Link>
              <Link
                href={PAGE_SEO.partidos.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Ver calendario de partidos
              </Link>
              <Link
                href={PAGE_SEO.partidosEnVivoMundial.path}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
              >
                Partidos en vivo
              </Link>
            </div>
          </section>
        </PageContentAds>
      </SeoLandingLayout>
    </MarketingPageMain>
  );
}
