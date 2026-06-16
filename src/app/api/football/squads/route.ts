import { NextResponse } from "next/server";
import { squadsApiCacheHeaders } from "@/lib/football-api/http-cache";
import { footballDataProvider } from "@/lib/football-api/provider";

export async function GET() {
  const payload = await footballDataProvider.getSquads();
  return NextResponse.json(payload, { headers: squadsApiCacheHeaders });
}
