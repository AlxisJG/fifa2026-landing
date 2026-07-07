import { NextResponse } from "next/server";
import { readWordPressSnapshotMeta } from "@/lib/cache/wordpress-snapshot";
import { refreshPostsSnapshot } from "@/lib/posts";
import { isCronAuthorized } from "@/lib/push/cron-auth";

export const dynamic = "force-dynamic";

/** Cron / manual refresh of noticias Redis snapshot (every 3h on Vercel). */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const before = await readWordPressSnapshotMeta("posts");
  const result = await refreshPostsSnapshot();

  return NextResponse.json({
    namespace: "posts",
    before,
    ...result
  });
}
