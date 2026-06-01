export type WpCategory = { id: number; slug?: string; name?: string };

export type WpMedia = {
  id: number;
  source_url?: string;
  alt_text?: string;
  title?: { rendered?: string };
  caption?: { rendered?: string };
  description?: { rendered?: string };
  media_details?: { width?: number; height?: number };
};

export function getWpRestBase(fifappUrl: string): string {
  return fifappUrl.replace(/\/fifapp\/v1\/?$/, "");
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function extractDuration(...fields: (string | undefined)[]): string {
  for (const field of fields) {
    if (!field) continue;
    const match = stripHtml(field).match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/);
    if (match) return match[1];
  }
  return "";
}

export async function resolveCategoryId(wpRestBase: string, slug: string): Promise<number | null> {
  const res = await fetch(`${wpRestBase}/wp/v2/categories?slug=${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) return null;

  const terms = (await res.json()) as WpCategory[];
  return terms[0]?.id ?? null;
}

export async function fetchMediaByCategory(wpRestBase: string, categoryId: number): Promise<WpMedia[]> {
  const params = new URLSearchParams({
    categories: String(categoryId),
    per_page: "100",
    _fields: "id,source_url,alt_text,title,caption,description,media_details"
  });

  const res = await fetch(`${wpRestBase}/wp/v2/media?${params.toString()}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) return [];

  const raw = (await res.json()) as WpMedia[];
  return Array.isArray(raw) ? raw : [];
}

export async function fetchMediaForCategorySlug(
  fifappUrl: string | undefined,
  categorySlug: string
): Promise<WpMedia[]> {
  if (!fifappUrl) return [];

  const wpRestBase = getWpRestBase(fifappUrl);
  const categoryId = await resolveCategoryId(wpRestBase, categorySlug);
  if (!categoryId) return [];

  return fetchMediaByCategory(wpRestBase, categoryId);
}
