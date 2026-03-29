"use client";

import { useEffect, useState } from "react";
import { WeatherDay } from "@/types";

interface WeatherForecastProps {
  lat: number;
  lng: number;
}

export default function WeatherForecast({ lat, lng }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        setForecast(data.forecast);
      } catch {
        setError("לא ניתן לטעון תחזית מזג אוויר");
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="text-sm text-gray-400 py-2">טוען תחזית מזג אוויר...</div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-400 py-2">{error}</div>;
  }

  if (forecast.length === 0) return null;

  return (
    <div className="mt-3">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">
        תחזית מזג אוויר (3 ימים קרובים)
      </h4>
      <div className="flex gap-3">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="bg-blue-50 rounded-lg p-3 text-center flex-1 min-w-0"
          >
            <div className="text-xs text-gray-500">
              {new Date(day.date).toLocaleDateString("he-IL", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
            <img
              src={day.icon.startsWith("//") ? `https:${day.icon}` : day.icon}
              alt={day.description}
              className="w-10 h-10 mx-auto"
            />
            <div className="text-xs font-medium text-gray-700">
              {day.tempMin}° - {day.tempMax}°
            </div>
            <div className="text-xs text-gray-500 truncate">
              {day.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
