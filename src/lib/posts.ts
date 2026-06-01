import { news as fallbackNews } from "@/data/landing-content";
import type { PostItem } from "@/lib/posts-types";

function sortPostsByDate(posts: PostItem[]): PostItem[] {
  return [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

const staticPosts: PostItem[] = fallbackNews.map((item, index) => ({
  id: `fallback-${index}`,
  title: item.title,
  category: item.category,
  image: item.image,
  excerpt: "",
  date: "",
  source: "static"
}));

function wpToPost(raw: Record<string, unknown>): PostItem | null {
  const titleRaw = raw.title as { rendered?: string } | string | undefined;
  const title = typeof titleRaw === "string" ? titleRaw : titleRaw?.rendered;
  if (!title) return null;

  const categories = raw.categories as Array<{ name?: string }> | undefined;
  const embedded = raw._embedded as { "wp:featuredmedia"?: Array<{ source_url?: string }> } | undefined;

  return {
    id: String(raw.id ?? title.slice(0, 20)),
    title,
    category: categories?.[0]?.name ?? (raw.category as string | undefined) ?? "Noticias",
    image:
      (raw.image as string | undefined) ??
      (raw.featured_image as string | undefined) ??
      embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
      "",
    excerpt:
      typeof raw.excerpt === "string"
        ? raw.excerpt
        : ((raw.excerpt as { rendered?: string } | undefined)?.rendered ?? ""),
    date: (raw.date as string | undefined) ?? "",
    source: "wordpress"
  };
}

export async function getPosts(): Promise<PostItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!baseUrl) {
    return staticPosts;
  }

  try {
    const res = await fetch(`${baseUrl}/posts?tag=fifa-2026`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return staticPosts;
    }

    const json = await res.json();
    const raw = json?.data?.posts ?? json?.data ?? json;

    if (!Array.isArray(raw)) {
      return staticPosts;
    }

    const wpPosts = raw.map((item) => wpToPost(item as Record<string, unknown>)).filter(Boolean) as PostItem[];
    return wpPosts.length > 0 ? sortPostsByDate(wpPosts) : staticPosts;
  } catch {
    return staticPosts;
  }
}
