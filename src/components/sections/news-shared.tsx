"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { news as fallbackNews } from "@/data/landing-content";
import type { PostItem } from "@/lib/posts-types";
import { getPostPath } from "@/lib/posts-slug";
import { formatDateRd } from "@/lib/datetime-rd";
import { fwc26NewsBold, fwc26NewsMedium } from "@/lib/fonts/fwc26-news";

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
  url?: string;
  slug?: string;
  date?: string;
  tall?: boolean;
  uniform?: boolean;
  homeFeatured?: boolean;
  homeFeaturedLead?: boolean;
  editorialTypography?: boolean;
  matchAdHeight?: boolean;
  priority?: boolean;
};

export function NewsCard({
  image,
  title,
  category,
  url,
  slug,
  date,
  tall = false,
  uniform = false,
  homeFeatured = false,
  homeFeaturedLead = false,
  editorialTypography = false,
  matchAdHeight = false,
  priority = false
}: NewsCardProps) {
  const safeTitle = stripHtml(title);
  const safeCategory = stripHtml(category);
  const showEditorialTypography = homeFeatured || editorialTypography || homeFeaturedLead;

  const editorialTitleClass = homeFeaturedLead
    ? "text-lg sm:text-xl md:text-2xl"
    : uniform
      ? "text-base sm:text-lg"
      : tall
        ? "text-base sm:text-xl sm:text-2xl"
        : matchAdHeight
          ? "text-base sm:text-lg"
          : "text-base sm:text-xl";

  const heightClass = homeFeaturedLead
    ? "aspect-[16/10] sm:aspect-[16/9]"
    : uniform
      ? "aspect-[4/3]"
      : homeFeatured && tall
        ? "h-[340px] sm:h-[460px]"
        : homeFeatured && matchAdHeight
          ? "h-[300px] sm:h-[320px]"
          : homeFeatured
            ? "h-56 sm:h-64"
            : tall
              ? "h-[270px] sm:h-[360px]"
              : matchAdHeight
                ? "h-[250px]"
                : "h-40 sm:h-44";

  const editorialTextBlock = showEditorialTypography ? (
    <>
      <span
        className={`inline-block w-fit max-w-full bg-[#d71920] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] sm:text-[11px] ${fwc26NewsMedium.className}`}
        style={{ color: "#ffffff" }}
      >
        {safeCategory}
      </span>
      <h3
        className={`mt-2 line-clamp-3 w-full font-bold leading-tight ${editorialTitleClass} ${fwc26NewsBold.className} ${homeFeaturedLead ? "text-slate-900" : ""}`}
        style={
          homeFeaturedLead
            ? undefined
            : { color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.65)" }
        }
      >
        {safeTitle}
      </h3>
      {date && (
        <p
          className={`mt-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs ${fwc26NewsMedium.className} ${homeFeaturedLead ? "text-slate-600" : ""}`}
          style={homeFeaturedLead ? undefined : { color: "#ffffff" }}
        >
          {formatDateRd(date)}
        </p>
      )}
    </>
  ) : (
    <>
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
          {formatDateRd(date)}
        </p>
      )}
    </>
  );

  const card = homeFeaturedLead ? (
    <>
      <div className={`relative w-full overflow-hidden ${heightClass}`}>
        <NewsCardImage src={image} alt={safeTitle} priority={priority} />
      </div>
      <div className="flex flex-col items-start bg-white p-4 sm:p-5">{editorialTextBlock}</div>
    </>
  ) : (
    <>
      <div className={`relative w-full ${heightClass}`}>
        <NewsCardImage src={image} alt={safeTitle} priority={priority} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.08) 72%, transparent 100%)"
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">{editorialTextBlock}</div>
      </div>
    </>
  );

  const shellClass = homeFeaturedLead
    ? "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.12)] transition-shadow hover:shadow-[0_16px_44px_rgba(15,23,42,0.18)]"
    : "group relative block overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-[0_12px_36px_rgba(15,23,42,0.14)] transition-shadow hover:shadow-[0_16px_44px_rgba(15,23,42,0.2)]";

  const internalHref = getPostPath({ title, url, slug });
  const externalUrl = url?.trim();

  if (internalHref) {
    return (
      <motion.div whileHover={{ y: -4 }} className={shellClass}>
        <Link href={internalHref} className="block h-full" aria-label={`Leer noticia: ${safeTitle}`}>
          {card}
        </Link>
      </motion.div>
    );
  }

  if (externalUrl) {
    return (
      <motion.a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -4 }}
        className={shellClass}
        aria-label={`Leer noticia: ${safeTitle}`}
      >
        {card}
      </motion.a>
    );
  }

  return (
    <motion.article whileHover={{ y: -4 }} className={shellClass}>
      {card}
    </motion.article>
  );
}
