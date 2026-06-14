import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getSitemapNewsSlugs } from "@/lib/posts";
import { PAGE_SEO } from "@/lib/seo/pages";
import { absoluteSiteUrl, SITE_URL } from "@/lib/seo/site";

/** 5 min — sync with WORDPRESS_CACHE_SECONDS in src/lib/cache/wordpress.ts */
export const revalidate = 300;

const getCachedSitemapNewsSlugs = unstable_cache(
  getSitemapNewsSlugs,
  ["sitemap-news-slugs"],
  { revalidate: 300 }
);

type SitemapEntry = MetadataRoute.Sitemap[number];

function staticEntry(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "weekly"
): SitemapEntry {
  return {
    url: absoluteSiteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pagePaths = Object.values(PAGE_SEO).map((page) => page.path);

  const entries: SitemapEntry[] = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    ...pagePaths.map((path) => staticEntry(path, path.includes("mundial") ? 0.9 : 0.8))
  ];

  try {
    const slugs = await getCachedSitemapNewsSlugs();
    for (const slug of slugs) {
      entries.push(staticEntry(`/noticias/${slug}`, 0.7, "weekly"));
    }
  } catch {
    // WordPress unavailable — static routes still published
  }

  return entries;
}
