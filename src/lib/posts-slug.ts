import type { PostItem } from "@/lib/posts-types";

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function slugifyPostTitle(title: string): string {
  return stripHtml(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function extractSlugFromUrl(url?: string): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    return last ? decodeURIComponent(last) : undefined;
  } catch {
    return undefined;
  }
}

export function getPostSlug(post: Pick<PostItem, "title" | "url" | "slug">): string {
  if (post.slug?.trim()) return post.slug.trim();
  const fromUrl = extractSlugFromUrl(post.url);
  if (fromUrl) return fromUrl;
  return slugifyPostTitle(post.title);
}

export function getPostPath(post: Pick<PostItem, "title" | "url" | "slug">): string {
  return `/noticias/${getPostSlug(post)}`;
}
