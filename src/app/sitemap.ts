import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/posts";
import { PAGE_SEO } from "@/lib/seo/pages";
import { absoluteSiteUrl } from "@/lib/seo/site";

/** 5 min — sync with WORDPRESS_CACHE_SECONDS in src/lib/cache/wordpress.ts */
export const revalidate = 300;

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
    staticEntry("/", 1, "daily"),
    ...pagePaths.map((path) => staticEntry(path, path.includes("mundial") ? 0.9 : 0.8))
  ];

  try {
    const slugs = await getPostSlugs();
    for (const slug of slugs) {
      entries.push(staticEntry(`/noticias/${slug}`, 0.7, "weekly"));
    }
  } catch {
    // WordPress unavailable — static routes still published
  }

  return entries;
}
