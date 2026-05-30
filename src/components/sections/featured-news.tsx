"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RectangleAdSlot } from "@/components/ads/rectangle-ad-slot";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { news as fallbackNews } from "@/data/landing-content";
import { rectanglePlacements } from "@/data/ad-placements";
import { usePosts } from "@/hooks/usePosts";
import type { PostItem } from "@/lib/posts-types";

const DEFAULT_NEWS_IMAGE = fallbackNews[0].image;

const fallbackPosts: PostItem[] = fallbackNews.map((item, index) => ({
  id: `fallback-${index}`,
  title: item.title,
  category: item.category,
  image: item.image,
  excerpt: "",
  date: "",
  source: "static"
}));

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function resolveImageUrl(url?: string) {
  const trimmed = url?.trim();
  return trimmed ? trimmed : DEFAULT_NEWS_IMAGE;
}

function isNextImageHost(url: string) {
  try {
    const host = new URL(url).hostname;
    return (
      host === "images.unsplash.com" ||
      host === "localhost" ||
      host.endsWith("piodeportes.com")
    );
  } catch {
    return false;
  }
}

function NewsCardImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const url = resolveImageUrl(src);

  if (isNextImageHost(url)) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src !== DEFAULT_NEWS_IMAGE) {
          target.src = DEFAULT_NEWS_IMAGE;
        }
      }}
    />
  );
}

function NewsCard({
  image,
  title,
  category,
  tall = false,
  matchAdHeight = false,
  priority = false
}: {
  image: string;
  title: string;
  category: string;
  tall?: boolean;
  matchAdHeight?: boolean;
  priority?: boolean;
}) {
  const safeTitle = stripHtml(title);
  const safeCategory = stripHtml(category);

  const heightClass = tall
    ? "h-[270px] sm:h-[360px]"
    : matchAdHeight
      ? "h-[250px]"
      : "h-40 sm:h-44";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-[0_12px_36px_rgba(15,23,42,0.14)]"
    >
      <div className={`relative w-full ${heightClass}`}>
        <NewsCardImage src={image} alt={safeTitle} priority={priority} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.08) 72%, transparent 100%)"
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.92)", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            {safeCategory}
          </p>
          <h3
            className={`mt-1 font-bold leading-tight ${tall ? "text-xl sm:text-2xl" : matchAdHeight ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
            style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.65)" }}
          >
            {safeTitle}
          </h3>
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedNewsSection() {
  const { posts: apiPosts, loading } = usePosts();
  const posts = apiPosts.length > 0 ? apiPosts : fallbackPosts;
  const gridPosts = posts.slice(0, 5);

  return (
    <section id="news" className="section-shell py-12 sm:py-16">
      <SectionTitle
        kicker="Noticias"
        title="Noticias de FIFA"
        subtitle="Cobertura del Mundial FIFA 2026, noticias FIFA y lo más relevante del futbol internacional."
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
        <div className="grid gap-4 xl:grid-cols-12">
          {gridPosts[0] && (
            <Reveal className="xl:col-span-7">
              <NewsCard
                image={gridPosts[0].image}
                title={gridPosts[0].title}
                category={gridPosts[0].category}
                tall
                priority
              />
            </Reveal>
          )}

          <div className="flex flex-col gap-4 xl:col-span-5">
            {gridPosts.slice(1, 3).map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                <NewsCard image={item.image} title={item.title} category={item.category} />
              </Reveal>
            ))}
          </div>

          {gridPosts.slice(3, 5).map((item, index) => (
            <Reveal key={item.id} delay={0.08 + index * 0.05} className="xl:col-span-4">
              <NewsCard image={item.image} title={item.title} category={item.category} matchAdHeight />
            </Reveal>
          ))}

          <Reveal delay={0.15} className="flex xl:col-span-4 xl:items-start xl:justify-center">
            <RectangleAdSlot placement={rectanglePlacements.featuredNews} className="self-center" />
          </Reveal>
        </div>
      )}

      <Reveal className="mt-8 text-center">
        <a
          href="https://piodeportes.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 hover:shadow-md"
        >
          Ver más noticias
          <span className="text-lg">→</span>
        </a>
      </Reveal>
    </section>
  );
}
