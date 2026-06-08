import { JsonLd } from "@/components/seo/json-ld";
import { buildHomepageGraphSchema } from "@/lib/seo/json-ld";
import type { Fixture } from "@/lib/football-api/types";
import type { PostItem } from "@/lib/posts-types";

type HomepageJsonLdProps = {
  posts: PostItem[];
  fixtures?: Fixture[];
};

export function HomepageJsonLd({ posts, fixtures = [] }: HomepageJsonLdProps) {
  return <JsonLd data={buildHomepageGraphSchema(posts, fixtures)} />;
}
