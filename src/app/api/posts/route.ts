import { NextResponse } from "next/server";
import { wordpressCdnCacheHeaders } from "@/lib/cache/wordpress";
import { getPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts, { headers: wordpressCdnCacheHeaders() });
}
