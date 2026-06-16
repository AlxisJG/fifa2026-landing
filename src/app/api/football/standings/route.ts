import { NextResponse } from "next/server";
import { standingsApiCacheHeaders } from "@/lib/football-api/http-cache";
import { footballDataProvider } from "@/lib/football-api/provider";

export async function GET() {
  const payload = await footballDataProvider.getStandings();
  return NextResponse.json(payload, { headers: standingsApiCacheHeaders });
}
