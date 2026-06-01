import { NextResponse } from "next/server";
import { getGallery } from "@/lib/gallery";

export async function GET() {
  const items = await getGallery();
  return NextResponse.json(items);
}
