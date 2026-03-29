import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Route } from "@/models/Route";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    const body = await request.json();

    await connectDB();

    const route = await Route.create({
      userId: payload.sub,
      country: body.country,
      city: body.city,
      tripType: body.tripType,
      durationDays: body.durationDays,
      routes: body.routes,
      approvedAt: new Date(),
    });

    return NextResponse.json({ id: route._id }, { status: 201 });
  } catch (error: any) {
    console.error("Save route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save route" },
      { status: 500 }
    );
  }
}
