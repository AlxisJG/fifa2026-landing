"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { news as fallbackNews } from "@/data/landing-content";
import { usePosts } from "@/hooks/usePosts";
import type { PostItem } from "@/lib/posts-types";

export const DEFAULT_NEWS_IMAGE = fallbackNews[0].image;

export const fallbackPosts: PostItem[] = fallbackNews.map((item, index) => ({
  id: `fallback-${index}`,
  title: item.title,
  category: item.category,
  image: item.image,
  excerpt: "",
  date: "",
  source: "static"
}));

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function resolveImageUrl(url?: string) {
  const trimmed = url?.trim();
  return trimmed ? trimmed : DEFAULT_NEWS_IMAGE;
}

function isNextImageHost(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "images.unsplash.com" || host === "localhost" || host.endsWith("piodeportes.com");
  } catch {
    return false;
  }
}

export function sortPostsByDate(posts: PostItem[]): PostItem[] {
  return [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

export function NewsCardImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
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

type NewsCardProps = {
  image: string;
  title: string;
  category: string;
  date?: string;
  tall?: boolean;
  uniform?: boolean;
  matchAdHeight?: boolean;
  priority?: boolean;
};

export function NewsCard({
  image,
  title,
  category,
  date,
  tall = false,
  uniform = false,
  matchAdHeight = false,
  priority = false
}: NewsCardProps) {
  const safeTitle = stripHtml(title);
  const safeCategory = stripHtml(category);

  const heightClass = uniform
    ? "aspect-[4/3]"
    : tall
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
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.08) 72%, transparent 100%)"
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
            className={`mt-1 font-bold leading-tight ${uniform ? "text-base sm:text-lg" : tall ? "text-xl sm:text-2xl" : matchAdHeight ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
            style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.65)" }}
          >
            {safeTitle}
          </h3>
          {date && uniform && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/70">
              {new Date(date).toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
