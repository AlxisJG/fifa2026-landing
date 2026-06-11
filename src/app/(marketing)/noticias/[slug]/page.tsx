import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, ArticleSourceFooter } from "@/components/sections/article-content";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDateRd } from "@/lib/datetime-rd";
import { getPostBySlug } from "@/lib/posts";
import { getPostPath, stripHtml } from "@/lib/posts-slug";
import { buildArticleSchema } from "@/lib/seo/json-ld";
import { buildSocialMetadata } from "@/lib/seo/metadata-shared";
import { PAGE_SEO } from "@/lib/seo/pages";
import { absoluteSiteUrl } from "@/lib/seo/site";
import type { Metadata } from "next";

/** 5 min — sync with WORDPRESS_CACHE_SECONDS in src/lib/cache/wordpress.ts */
export const revalidate = 300;

/** Evita pre-render masivo en build (timeouts a WordPress). ISR bajo demanda. */
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = `${stripHtml(post.title)} | Pio Deportes`;
  const description = stripHtml(post.content ?? post.excerpt ?? post.title).slice(0, 160);
  const path = getPostPath(post);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteSiteUrl(path) },
    ...buildSocialMetadata({
      title,
      description,
      path,
      imagePath: post.image || undefined,
      imageAlt: stripHtml(post.title)
    }),
    robots: { index: true, follow: true }
  };
}

export default async function NoticiaArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const safeTitle = stripHtml(post.title);
  const bodyHtml = post.content?.trim() || post.excerpt?.trim() || "";

  return (
    <MarketingPageMain>
      <JsonLd data={buildArticleSchema(post, 0)} />
      <Breadcrumbs
        items={[
          { name: "Inicio", path: "/" },
          { name: "Noticias", path: PAGE_SEO.noticias.path },
          { name: safeTitle }
        ]}
      />
      <article className="section-shell pb-16 pt-6 sm:pb-20">
        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
            {stripHtml(post.category)}
          </p>
          <h1 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-4xl">{safeTitle}</h1>
          {post.date && (
            <time dateTime={post.date} className="mt-4 block text-sm text-slate-500">
              {formatDateRd(post.date)}
            </time>
          )}
        </header>

        {post.image && (
          <div className="relative mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={safeTitle}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        )}

        <div className="mt-8 max-w-3xl">
          {bodyHtml ? (
            <ArticleBody html={bodyHtml} />
          ) : (
            <p className="text-base leading-relaxed text-slate-700">
              Cobertura de PIO Deportes sobre el Mundial FIFA 2026 y el futbol internacional.
            </p>
          )}
        </div>

        <div className="max-w-3xl">
          <ArticleSourceFooter originalUrl={post.url} />
        </div>

        <div className="mt-10 flex max-w-3xl flex-wrap gap-3">
          <Link
            href={PAGE_SEO.noticias.path}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
          >
            ← Todas las noticias
          </Link>
          <Link
            href={PAGE_SEO.mundial2026Rd.path}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800"
          >
            Mundial 2026 en RD
          </Link>
          <Link
            href={PAGE_SEO.partidos.path}
            className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-midnight"
          >
            Ver partidos
          </Link>
        </div>
      </article>
    </MarketingPageMain>
  );
}
