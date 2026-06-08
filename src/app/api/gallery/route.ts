import { NextResponse } from "next/server";
import { wordpressCdnCacheHeaders } from "@/lib/cache/wordpress";
import { getGallery } from "@/lib/gallery";

export async function GET() {
  const items = await getGallery();
  return NextResponse.json(items, { headers: wordpressCdnCacheHeaders() });
}
