import { NextResponse } from "next/server";
import { footballDataProvider } from "@/lib/football-api/provider";

export async function GET() {
  const payload = await footballDataProvider.getTopscorers();
  return NextResponse.json(payload);
}
