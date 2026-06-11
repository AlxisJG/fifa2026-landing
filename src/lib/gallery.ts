import { withWordPressSnapshot } from "@/lib/cache/wordpress-snapshot";
import { gallery as fallbackGallery } from "@/data/landing-content";
import type { GalleryItem } from "@/lib/gallery-types";
import { fetchMediaForCategorySlug, stripHtml, type WpMedia } from "@/lib/wordpress-media";

const DEFAULT_CATEGORY_SLUG = "fifa2026galeria";

function wpMediaToGalleryItem(raw: WpMedia): GalleryItem | null {
  const src = raw.source_url?.trim();
  if (!src) return null;

  const width = raw.media_details?.width ?? 1200;
  const height = raw.media_details?.height ?? 800;
  const title = raw.title?.rendered ? stripHtml(raw.title.rendered) : "";
  const alt = raw.alt_text?.trim() || title || "Imagen de la galería FIFA 2026";

  return {
    id: String(raw.id),
    src,
    alt,
    width,
    height,
    source: "wordpress"
  };
}

const staticGallery: GalleryItem[] = fallbackGallery.map((item, index) => ({
  id: `fallback-${index}`,
  ...item,
  source: "static"
}));

export async function getGallery(): Promise<GalleryItem[]> {
  const categorySlug =
    process.env.NEXT_PUBLIC_WP_GALLERY_CATEGORY_SLUG?.trim() || DEFAULT_CATEGORY_SLUG;

  const raw = await withWordPressSnapshot("gallery", async () => {
    const media = await fetchMediaForCategorySlug(process.env.NEXT_PUBLIC_WP_API_URL, categorySlug);
    return media.length > 0 ? media : null;
  });

  if (!raw || raw.length === 0) {
    return staticGallery;
  }

  const items = raw.map(wpMediaToGalleryItem).filter(Boolean) as GalleryItem[];
  return items.length > 0 ? items : staticGallery;
}
