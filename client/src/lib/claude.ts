import { GoogleGenerativeAI } from "@google/generative-ai";
import { RouteSegment } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildPrompt(
  country: string,
  city: string,
  tripType: "trek" | "bicycle",
  durationDays: number
): string {
  if (tripType === "bicycle") {
    return `Plan a bicycle touring route near ${city}, ${country}.
Duration: ${durationDays} days.

Requirements:
- City-to-city route, between 30-70 km per day
- Each day is one segment
- Coordinates MUST follow real roads - provide 20-40 coordinate pairs per day segment tracing the actual road path
- Include start/end city names for each day
- Include total distance and estimated elevation gain per day

Return ONLY valid JSON (no markdown fences, no commentary) matching this schema:
{
  "routes": [
    {
      "name": "Day 1: CityA → CityB",
      "description": "Description of the route and notable landmarks",
      "distanceKm": 45,
      "elevationGainM": 300,
      "waypoints": [
        {"lat": 0.0, "lng": 0.0, "label": "CityA (start)"},
        {"lat": 0.0, "lng": 0.0, "label": "Landmark"},
        {"lat": 0.0, "lng": 0.0, "label": "CityB (end)"}
      ],
      "polyline": [[lat,lng], [lat,lng], ...],
      "centerLat": 0.0,
      "centerLng": 0.0
    }
  ]
}`;
  }

  return `Plan ${durationDays <= 3 ? durationDays : 3} circular hiking/trekking routes near ${city}, ${country}.
Each route is a separate 1-day loop (start point = end point), between 5-10 km each.

Requirements:
- Each route is independent (not connected to others)
- Coordinates MUST follow real hiking trails - provide 15-30 coordinate pairs per route tracing the actual trail
- The first and last coordinate pair MUST be identical (circular loop)
- Include trail name if known
- Include estimated elevation gain

Return ONLY valid JSON (no markdown fences, no commentary) matching this schema:
{
  "routes": [
    {
      "name": "Route 1: Trail Name",
      "description": "Description of the trail and scenery",
      "distanceKm": 7,
      "elevationGainM": 400,
      "waypoints": [
        {"lat": 0.0, "lng": 0.0, "label": "Trailhead (start/end)"},
        {"lat": 0.0, "lng": 0.0, "label": "Viewpoint"},
        {"lat": 0.0, "lng": 0.0, "label": "Trailhead (start/end)"}
      ],
      "polyline": [[lat,lng], [lat,lng], ...],
      "centerLat": 0.0,
      "centerLng": 0.0
    }
  ]
}`;
}

export async function generateRoutes(
  country: string,
  city: string,
  tripType: "trek" | "bicycle",
  durationDays: number
): Promise<RouteSegment[]> {
  const prompt = buildPrompt(country, city, tripType, durationDays);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are a professional travel route planner. You produce GPS route data in JSON format. Your coordinates MUST follow real, existing roads and trails - never straight lines between points. You have extensive knowledge of global geography, trail networks, and cycling routes. Always return valid JSON matching the schema provided. Never include markdown fences or commentary outside the JSON.",
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  let jsonText = response.text().trim();

  // Strip markdown fences if present
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText);

  const routes: RouteSegment[] = parsed.routes.map((r: any) => ({
    name: r.name,
    description: r.description,
    distanceKm: r.distanceKm,
    waypoints: r.waypoints,
    polyline: r.polyline,
    centerLat:
      r.centerLat ||
      r.polyline.reduce((s: number, p: number[]) => s + p[0], 0) /
        r.polyline.length,
    centerLng:
      r.centerLng ||
      r.polyline.reduce((s: number, p: number[]) => s + p[1], 0) /
        r.polyline.length,
    imageUrl: null,
    elevationGainM: r.elevationGainM || null,
  }));

  return routes;
}
