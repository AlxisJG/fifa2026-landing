import { NextResponse } from "next/server";
import { getFootballDataStatus } from "@/lib/football-api/config";

export async function GET() {
  return NextResponse.json(getFootballDataStatus());
}
