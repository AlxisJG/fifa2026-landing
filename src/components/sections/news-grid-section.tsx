"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { RectangleAdSlot } from "@/components/ads/rectangle-ad-slot";
import { Reveal } from "@/components/ui/motion";
import { usePosts } from "@/hooks/usePosts";
import type { PostItem } from "@/lib/posts-types";
import { isAdsEnabled } from "@/lib/ads-gate";
import { rectanglePlacements } from "@/data/ad-placements";
import { NewsCard, fallbackPosts, sortPostsByDate } from "@/components/sections/news-shared";
import { ListPagination } from "@/components/ui/list-pagination";

export const NEWS_SLOTS_PER_PAGE = 9;
export const NEWS_POSTS_PER_PAGE = 8;
/** Índice en grid 3×3: fila central, columna derecha */
export const NEWS_INLINE_AD_INDEX = 5;

type GridCell = { kind: "post"; post: PostItem } | { kind: "ad" };

function getPostsPerPage(adsEnabled: boolean) {
  return adsEnabled ? NEWS_POSTS_PER_PAGE : NEWS_SLOTS_PER_PAGE;
}

function buildPageGrid(posts: PostItem[], page: number, adsEnabled: boolean): GridCell[] {
  const postsPerPage = getPostsPerPage(adsEnabled);
  const start = (page - 1) * postsPerPage;
  const pagePosts = posts.slice(start, start + postsPerPage);
  const cells: GridCell[] = [];
  let postIndex = 0;

  for (let slot = 0; slot < NEWS_SLOTS_PER_PAGE; slot++) {
    if (adsEnabled && slot === NEWS_INLINE_AD_INDEX) {
      cells.push({ kind: "ad" });
      continue;
    }
    if (postIndex < pagePosts.length) {
      cells.push({ kind: "post", post: pagePosts[postIndex] });
      postIndex += 1;
    }
  }

  return cells;
}

function NewsGridAdCell() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-slate-50/80 p-3 sm:min-h-0 sm:aspect-[4/3]">
      <RectangleAdSlot placement={rectanglePlacements.newsListing} className="w-full max-w-[300px]" responsive />
    </div>
  );
}

function NewsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: NEWS_SLOTS_PER_PAGE }).map((_, index) => (
        <div key={index} className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200" />
      ))}
    </div>
  );
}

type NewsGridSectionProps = {
  initialPosts?: PostItem[];
};

export function NewsGridSection({ initialPosts }: NewsGridSectionProps) {
  const searchParams = useSearchParams();
  const adsEnabled = isAdsEnabled();
  const { posts: apiPosts, loading } = usePosts(initialPosts);
  const posts = useMemo(
    () => sortPostsByDate(apiPosts.length > 0 ? apiPosts : fallbackPosts),
    [apiPosts]
  );

  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const postsPerPage = getPostsPerPage(adsEnabled);
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const gridCells = useMemo(
    () => buildPageGrid(posts, safePage, adsEnabled),
    [posts, safePage, adsEnabled]
  );

  if (loading) {
    return (
      <section className="section-shell pb-16 sm:pb-20">
        <NewsGridSkeleton />
      </section>
    );
  }

  return (
    <section className="section-shell pb-16 sm:pb-20">
      <Reveal ready={!loading} key={`news-page-${safePage}`}>
      {gridCells.length === 0 ? (
        <p className="text-sm text-slate-600">No hay noticias disponibles por el momento.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridCells.map((cell, index) => {
            if (cell.kind === "ad") {
              return <NewsGridAdCell key="inline-ad" />;
            }

            return (
              <NewsCard
                key={cell.post.id}
                image={cell.post.image}
                title={cell.post.title}
                category={cell.post.category}
                url={cell.post.url}
                slug={cell.post.slug}
                date={cell.post.date}
                uniform
                editorialTypography
                priority={safePage === 1 && index < 3}
              />
            );
          })}
        </div>
      )}

      <ListPagination currentPage={safePage} totalPages={totalPages} />
      </Reveal>
    </section>
  );
}
