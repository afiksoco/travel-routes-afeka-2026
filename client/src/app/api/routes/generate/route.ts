import { NextRequest, NextResponse } from "next/server";
import { generateRoutes } from "@/lib/claude";
import { getImage } from "@/lib/unsplash";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, city, tripType, durationDays } = body;

    if (!country || !city || !tripType || !durationDays) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const routes = await generateRoutes(country, city, tripType, durationDays);

    // Fetch image for the destination
    const imageUrl = await getImage(`${city} ${country} landscape`);
    if (imageUrl) {
      routes.forEach((r) => (r.imageUrl = imageUrl));
    }

    return NextResponse.json({ routes });
  } catch (error: any) {
    console.error("Route generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate routes" },
      { status: 500 }
    );
  }
}
