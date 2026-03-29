export interface Waypoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface RouteSegment {
  name: string;
  description: string;
  distanceKm: number;
  waypoints: Waypoint[];
  polyline: [number, number][];
  centerLat: number;
  centerLng: number;
  imageUrl: string | null;
  elevationGainM: number | null;
}

export interface SavedRoute {
  _id: string;
  userId: string;
  country: string;
  city: string;
  tripType: "trek" | "bicycle";
  durationDays: number;
  routes: RouteSegment[];
  approvedAt: string;
  createdAt: string;
}

export interface WeatherDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}
