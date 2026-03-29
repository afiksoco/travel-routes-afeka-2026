"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Waypoint } from "@/types";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewInnerProps {
  polyline: [number, number][];
  waypoints: Waypoint[];
  center: [number, number];
}

export default function MapViewInner({
  polyline,
  waypoints,
  center,
}: MapViewInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: "350px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polyline.length > 0 && (
        <Polyline
          positions={polyline}
          pathOptions={{ color: "#2563eb", weight: 4 }}
        />
      )}
      {waypoints.map((wp, i) => (
        <Marker key={i} position={[wp.lat, wp.lng]} icon={defaultIcon}>
          <Popup>{wp.label || `נקודה ${i + 1}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
