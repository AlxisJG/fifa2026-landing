export type PostItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  /** URL canónica del artículo en piodeportes.com */
  url?: string;
  excerpt?: string;
  date?: string;
  source: "static" | "wordpress";
};
