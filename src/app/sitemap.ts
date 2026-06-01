import type { MetadataRoute } from "next";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", ...Object.values(PAGE_SEO).map((page) => page.path)];

  return staticPaths.map((path) => ({
    url: new URL(path || "/", SITE_URL).href,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8
  }));
}
