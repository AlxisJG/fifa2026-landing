import { matchSummaries as fallbackHighlights } from "@/data/landing-content";
import type { HighlightItem } from "@/lib/highlights-types";
import {
  extractDuration,
  fetchMediaForCategorySlug,
  stripHtml,
  type WpMedia
} from "@/lib/wordpress-media";

const DEFAULT_CATEGORY_SLUG = "fifa2026highlights";

function wpMediaToHighlight(raw: WpMedia): HighlightItem | null {
  const image = raw.source_url?.trim();
  if (!image) return null;

  const titleHtml = raw.title?.rendered ?? "";
  const captionHtml = raw.caption?.rendered ?? "";
  const descriptionHtml = raw.description?.rendered ?? "";
  const title =
    stripHtml(titleHtml) ||
    raw.alt_text?.trim() ||
    stripHtml(captionHtml) ||
    "Highlight FIFA 2026";

  const duration = extractDuration(captionHtml, descriptionHtml, titleHtml);

  return {
    id: String(raw.id),
    title,
    duration,
    image,
    source: "wordpress"
  };
}

const staticHighlights: HighlightItem[] = fallbackHighlights.map((item) => ({
  ...item,
  source: "static"
}));

export async function getHighlights(): Promise<HighlightItem[]> {
  const categorySlug =
    process.env.NEXT_PUBLIC_WP_HIGHLIGHTS_CATEGORY_SLUG?.trim() || DEFAULT_CATEGORY_SLUG;

  try {
    const raw = await fetchMediaForCategorySlug(process.env.NEXT_PUBLIC_WP_API_URL, categorySlug);
    const items = raw.map(wpMediaToHighlight).filter(Boolean) as HighlightItem[];
    return items.length > 0 ? items : staticHighlights;
  } catch {
    return staticHighlights;
  }
}
