import { news as fallbackNews } from "@/data/landing-content";
import type { PostItem } from "@/lib/posts-types";
import { extractSlugFromUrl, getPostSlug, slugifyPostTitle } from "@/lib/posts-slug";

function sortPostsByDate(posts: PostItem[]): PostItem[] {
  return [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

function withSlug(post: PostItem): PostItem {
  return { ...post, slug: getPostSlug(post) };
}

const staticPosts: PostItem[] = fallbackNews.map((item, index) =>
  withSlug({
    id: `fallback-${index}`,
    title: item.title,
    category: item.category,
    image: item.image,
    excerpt: "",
    date: "",
    source: "static"
  })
);

function wpToPost(raw: Record<string, unknown>): PostItem | null {
  const titleRaw = raw.title as { rendered?: string } | string | undefined;
  const title = typeof titleRaw === "string" ? titleRaw : titleRaw?.rendered;
  if (!title) return null;

  const categories = raw.categories as Array<{ name?: string }> | undefined;
  const embedded = raw._embedded as { "wp:featuredmedia"?: Array<{ source_url?: string }> } | undefined;

  const link = (raw.link as string | undefined)?.trim();
  const rawSlug = (raw.slug as string | undefined)?.trim();

  const post: PostItem = {
    id: String(raw.id ?? title.slice(0, 20)),
    title,
    category: categories?.[0]?.name ?? (raw.category as string | undefined) ?? "Noticias",
    url: link || undefined,
    slug: rawSlug || extractSlugFromUrl(link) || slugifyPostTitle(title),
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

  return withSlug(post);
}

function extractPostsPayload(json: unknown): {
  posts: Record<string, unknown>[];
  totalPages: number;
} {
  const root = json as {
    data?: { posts?: unknown; total_pages?: number } | unknown[];
    posts?: unknown;
  };

  const data = root?.data;
  if (data && typeof data === "object" && !Array.isArray(data) && Array.isArray(data.posts)) {
    return {
      posts: data.posts as Record<string, unknown>[],
      totalPages: typeof data.total_pages === "number" && data.total_pages > 0 ? data.total_pages : 1
    };
  }

  if (Array.isArray(data)) {
    return { posts: data as Record<string, unknown>[], totalPages: 1 };
  }

  if (Array.isArray(root?.posts)) {
    return { posts: root.posts as Record<string, unknown>[], totalPages: 1 };
  }

  if (Array.isArray(json)) {
    return { posts: json as Record<string, unknown>[], totalPages: 1 };
  }

  return { posts: [], totalPages: 1 };
}

async function fetchAllWordPressPosts(baseUrl: string): Promise<Record<string, unknown>[]> {
  const allPosts: Record<string, unknown>[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await fetch(`${baseUrl}/posts?tag=fifa-2026&per_page=100&page=${page}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return page === 1 ? [] : allPosts;
    }

    const json = await res.json();
    const { posts, totalPages: reportedTotalPages } = extractPostsPayload(json);
    allPosts.push(...posts);
    totalPages = reportedTotalPages;
    page += 1;
  } while (page <= totalPages);

  return allPosts;
}

export async function getPosts(): Promise<PostItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!baseUrl) {
    return staticPosts;
  }

  try {
    const raw = await fetchAllWordPressPosts(baseUrl);

    if (raw.length === 0) {
      return staticPosts;
    }

    const wpPosts = raw.map((item) => wpToPost(item)).filter(Boolean) as PostItem[];
    return wpPosts.length > 0 ? sortPostsByDate(wpPosts) : staticPosts;
  } catch {
    return staticPosts;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => getPostSlug(post));
}

export async function getPostBySlug(slug: string): Promise<PostItem | undefined> {
  const normalized = decodeURIComponent(slug).toLowerCase();
  const posts = await getPosts();
  return posts.find((post) => getPostSlug(post).toLowerCase() === normalized);
}

export { getPostSlug, getPostPath } from "@/lib/posts-slug";
