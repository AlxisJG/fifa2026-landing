import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteSiteUrl } from "@/lib/seo/site";

export function buildOgImage(alt: string, path: string = DEFAULT_OG_IMAGE) {
  const url = path.startsWith("http") ? path : absoluteSiteUrl(path);
  return [{ url, width: 1200, height: 630, alt }];
}

export function buildSocialMetadata({
  title,
  description,
  path,
  imagePath = DEFAULT_OG_IMAGE,
  imageAlt
}: {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  imageAlt?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const canonical = absoluteSiteUrl(path);
  const images = buildOgImage(imageAlt ?? title, imagePath);

  return {
    openGraph: {
      type: "website",
      locale: "es_DO",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url)
    }
  };
}

export const ROOT_OG_IMAGE = buildOgImage(
  "PIO Deportes — Mundial FIFA 2026 en República Dominicana",
  DEFAULT_OG_IMAGE
);
