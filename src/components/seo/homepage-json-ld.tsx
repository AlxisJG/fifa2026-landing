import { JsonLd } from "@/components/seo/json-ld";
import { buildHomepageGraphSchema } from "@/lib/seo/json-ld";
import type { PostItem } from "@/lib/posts-types";

type HomepageJsonLdProps = {
  posts: PostItem[];
};

export function HomepageJsonLd({ posts }: HomepageJsonLdProps) {
  return <JsonLd data={buildHomepageGraphSchema(posts)} />;
}
