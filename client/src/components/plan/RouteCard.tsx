"use client";

import { RouteSegment } from "@/types";
import MapView from "./MapView";
import WeatherForecast from "./WeatherForecast";
import RouteImage from "./RouteImage";

interface RouteCardProps {
  route: RouteSegment;
  showWeather?: boolean;
}

export default function RouteCard({
  route,
  showWeather = true,
}: RouteCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{route.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{route.description}</p>
      <div className="flex gap-4 text-sm text-gray-500 mb-4">
        <span>
          מרחק: <strong>{route.distanceKm} ק&quot;מ</strong>
        </span>
        {route.elevationGainM && (
          <span>
            עלייה: <strong>{route.elevationGainM} מ&apos;</strong>
          </span>
        )}
      </div>

      <div className="rounded-xl overflow-hidden mb-3">
        <MapView
          polyline={route.polyline}
          waypoints={route.waypoints}
          center={[route.centerLat, route.centerLng]}
        />
      </div>

      <RouteImage imageUrl={route.imageUrl} alt={route.name} />

      {showWeather && (
        <WeatherForecast lat={route.centerLat} lng={route.centerLng} />
      )}
    </div>
  );
}
