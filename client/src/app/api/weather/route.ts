import { NextRequest, NextResponse } from "next/server";
import { getWeatherForecast } from "@/lib/weather";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Missing lat/lng params" },
        { status: 400 }
      );
    }

    const forecast = await getWeatherForecast(lat, lng);
    return NextResponse.json({ forecast });
  } catch (error: any) {
    console.error("Weather error:", error);
    return NextResponse.json(
      { error: error.message || "Weather fetch failed" },
      { status: 500 }
    );
  }
}
