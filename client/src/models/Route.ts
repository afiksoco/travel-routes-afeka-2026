import mongoose, { Schema, Document } from "mongoose";

const waypointSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    label: { type: String },
  },
  { _id: false }
);

const routeSegmentSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    waypoints: [waypointSchema],
    polyline: [[Number]],
    centerLat: { type: Number, required: true },
    centerLng: { type: Number, required: true },
    imageUrl: { type: String, default: null },
    elevationGainM: { type: Number, default: null },
  },
  { _id: false }
);

export interface IRoute extends Document {
  userId: string;
  country: string;
  city: string;
  tripType: "trek" | "bicycle";
  durationDays: number;
  routes: any[];
  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const routeSchema = new Schema<IRoute>(
  {
    userId: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    tripType: { type: String, enum: ["trek", "bicycle"], required: true },
    durationDays: { type: Number, required: true },
    routes: [routeSegmentSchema],
    approvedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Route =
  mongoose.models.Route || mongoose.model<IRoute>("Route", routeSchema);
