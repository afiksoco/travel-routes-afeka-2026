"use client";

import { useState } from "react";
import PlanForm from "@/components/plan/PlanForm";
import RouteCard from "@/components/plan/RouteCard";
import { RouteSegment } from "@/types";

export default function PlanPage() {
  const [routes, setRoutes] = useState<RouteSegment[]>([]);
  const [formData, setFormData] = useState<{
    country: string;
    city: string;
    tripType: "trek" | "bicycle";
    durationDays: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (data: {
    country: string;
    city: string;
    tripType: "trek" | "bicycle";
    durationDays: number;
  }) => {
    setLoading(true);
    setError("");
    setRoutes([]);
    setSaved(false);
    setFormData(data);

    try {
      const res = await fetch("/api/routes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Generation failed");
      }

      const result = await res.json();
      setRoutes(result.routes);
    } catch (err: any) {
      setError(err.message || "שגיאה ביצירת מסלולים");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData || routes.length === 0) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/routes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          routes,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed");
      }

      setSaved(true);
    } catch (err: any) {
      setError(err.message || "שגיאה בשמירת מסלולים");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">תכנון מסלולים</h1>

      <PlanForm onGenerate={handleGenerate} loading={loading} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {routes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              מסלולים שנוצרו ({routes.length})
            </h2>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
              >
                {saving ? "שומר..." : "אשר ושמור מסלולים"}
              </button>
            ) : (
              <span className="text-green-600 font-medium">
                נשמר בהצלחה!
              </span>
            )}
          </div>

          {routes.map((route, i) => (
            <RouteCard key={i} route={route} showWeather={true} />
          ))}
        </div>
      )}
    </div>
  );
}
