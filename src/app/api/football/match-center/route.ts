import { NextResponse } from "next/server";
import { footballDataProvider } from "@/lib/football-api/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await footballDataProvider.getFeaturedMatch();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" }
  });
}
