import { NextResponse } from "next/server";
import { topscorersApiCacheHeaders } from "@/lib/football-api/http-cache";
import { footballDataProvider } from "@/lib/football-api/provider";

export async function GET() {
  const payload = await footballDataProvider.getTopscorers();
  return NextResponse.json(payload, { headers: topscorersApiCacheHeaders });
}
