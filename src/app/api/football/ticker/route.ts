import { NextResponse } from "next/server";
import { footballDataProvider } from "@/lib/football-api/provider";

export async function GET() {
  const payload = await footballDataProvider.getTicker();
  return NextResponse.json(payload);
}
