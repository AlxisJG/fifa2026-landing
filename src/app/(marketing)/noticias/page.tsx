import { Suspense } from "react";
import { NewsGridSection } from "@/components/sections/news-grid-section";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getPosts } from "@/lib/posts";
import { buildArticleSchema } from "@/lib/seo/json-ld";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/pages";

/** Next.js requires a static literal for segment config (default 3 h). */
export const revalidate = 10800;

export const metadata = buildPageMetadata("noticias");

function NewsGridFallback() {
  return <div className="section-shell pb-16 sm:pb-20 h-96 animate-pulse rounded-3xl bg-slate-100" />;
}

export default async function NoticiasPage() {
  const posts = await getPosts();

  return (
    <MarketingPageMain>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": posts.slice(0, 12).map((post, index) => buildArticleSchema(post, index))
        }}
      />
      <Breadcrumbs
        items={[
          { name: "Inicio", path: "/" },
          { name: PAGE_SEO.noticias.h1 }
        ]}
      />
      <PageIntro config={PAGE_SEO.noticias} kicker="Noticias" />
      <PageContentAds page="noticias">
        <Suspense fallback={<NewsGridFallback />}>
          <NewsGridSection initialPosts={posts} />
        </Suspense>
      </PageContentAds>
    </MarketingPageMain>
  );
}
