"use client";

import Link from "next/link";
import { RectangleAdSlot } from "@/components/ads/rectangle-ad-slot";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { rectanglePlacements } from "@/data/ad-placements";
import { isAdsEnabled } from "@/lib/ads-gate";
import { usePosts } from "@/hooks/usePosts";
import { PAGE_SEO } from "@/lib/seo/pages";
import { NewsCard, fallbackPosts, sortPostsByDate } from "@/components/sections/news-shared";

export function LatestNewsSection() {
  const adsEnabled = isAdsEnabled();
  const { posts: apiPosts, loading } = usePosts();
  const posts = sortPostsByDate(apiPosts.length > 0 ? apiPosts : fallbackPosts);
  const gridPosts = posts.slice(0, 5);

  return (
    <section id="news" className="section-shell py-12 sm:py-16">
      <SectionTitle
        kicker="Noticias"
        title="Últimas noticias"
        subtitle="Lo más reciente del Mundial FIFA 2026 y el futbol internacional."
      />

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="h-[360px] animate-pulse rounded-3xl bg-slate-200 xl:col-span-7" />
          <div className="space-y-4 xl:col-span-5">
            <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      ) : (
        <Reveal ready={!loading}>
        <div className="grid gap-4 xl:grid-cols-12">
          {gridPosts[0] && (
            <div className="xl:col-span-7">
              <NewsCard
                image={gridPosts[0].image}
                title={gridPosts[0].title}
                category={gridPosts[0].category}
                url={gridPosts[0].url}
                tall
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-4 xl:col-span-5">
            {gridPosts.slice(1, 3).map((item) => (
              <NewsCard
                key={item.id}
                image={item.image}
                title={item.title}
                category={item.category}
                url={item.url}
              />
            ))}
          </div>

          {gridPosts.slice(3, 5).map((item) => (
            <div key={item.id} className="xl:col-span-4">
              <NewsCard
                image={item.image}
                title={item.title}
                category={item.category}
                url={item.url}
                matchAdHeight={adsEnabled}
              />
            </div>
          ))}

          {adsEnabled && (
            <div className="flex xl:col-span-4 xl:items-start xl:justify-center">
              <RectangleAdSlot placement={rectanglePlacements.featuredNews} className="self-center" />
            </div>
          )}
        </div>
        </Reveal>
      )}

      <Reveal ready={!loading} className="mt-8 text-center">
        <Link
          href={PAGE_SEO.noticias.path}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 hover:shadow-md"
        >
          Ver todas las noticias
          <span className="text-lg">→</span>
        </Link>
      </Reveal>
    </section>
  );
}
