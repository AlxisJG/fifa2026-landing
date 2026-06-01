import { NextResponse } from "next/server";
import { getHighlights } from "@/lib/highlights";

export async function GET() {
  const items = await getHighlights();
  return NextResponse.json(items);
}
