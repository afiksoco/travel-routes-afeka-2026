import { NextRequest, NextResponse } from "next/server";
import { getImage } from "@/lib/unsplash";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    if (!query) {
      return NextResponse.json(
        { error: "Missing query param" },
        { status: 400 }
      );
    }

    const imageUrl = await getImage(query);
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Image fetch failed" },
      { status: 500 }
    );
  }
}
