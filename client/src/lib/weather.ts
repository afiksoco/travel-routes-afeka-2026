import { WeatherDay } from "@/types";

export async function getWeatherForecast(
  lat: number,
  lng: number
): Promise<WeatherDay[]> {
  const apiKey = process.env.WEATHER_API_KEY!;
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=3&lang=he`
  );

  if (!res.ok) {
    throw new Error("Weather API error");
  }

  const data = await res.json();

  const days: WeatherDay[] = data.forecast.forecastday.map((day: any) => ({
    date: day.date,
    tempMin: Math.round(day.day.mintemp_c),
    tempMax: Math.round(day.day.maxtemp_c),
    description: day.day.condition.text,
    icon: day.day.condition.icon,
  }));

  return days;
}
