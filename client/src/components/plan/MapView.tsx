"use client";

import dynamic from "next/dynamic";
import { Waypoint } from "@/types";

const MapViewInner = dynamic(() => import("./MapViewInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
      טוען מפה...
    </div>
  ),
});

interface MapViewProps {
  polyline: [number, number][];
  waypoints: Waypoint[];
  center: [number, number];
}

export default function MapView({ polyline, waypoints, center }: MapViewProps) {
  return <MapViewInner polyline={polyline} waypoints={waypoints} center={center} />;
}
