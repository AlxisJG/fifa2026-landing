export type PostItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  /** Slug on-site para /noticias/[slug] */
  slug?: string;
  /** URL canónica del artículo en piodeportes.com (legacy WP) */
  url?: string;
  excerpt?: string;
  date?: string;
  source: "static" | "wordpress";
};
