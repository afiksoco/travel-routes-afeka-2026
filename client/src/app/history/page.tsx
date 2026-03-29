"use client";

import { useEffect, useState } from "react";
import { SavedRoute } from "@/types";
import RouteCard from "@/components/plan/RouteCard";
import Link from "next/link";

export default function HistoryPage() {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/routes/history");
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setSavedRoutes(data.routes);
      } catch (err: any) {
        setError(err.message || "שגיאה בטעינת היסטוריה");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          היסטוריית מסלולים
        </h1>
        <div className="text-center py-20 text-gray-400">
          <svg
            className="animate-spin h-8 w-8 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          טוען היסטוריה...
        </div>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        היסטוריית מסלולים
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {savedRoutes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="text-gray-500 text-lg mb-4">עדיין לא תכננת מסלולים</p>
          <Link
            href="/plan"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            תכנן מסלול ראשון
          </Link>
        </div>
      ) : (
        savedRoutes.map((saved) => (
          <div key={saved._id} className="mb-4">
            <button
              onClick={() => toggleExpand(saved._id)}
              className="w-full bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all text-right"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {saved.tripType === "trek" ? "🥾" : "🚴"}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {saved.city}, {saved.country}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>
                        {saved.tripType === "trek" ? "טרק רגלי" : "אופניים"}
                      </span>
                      <span>•</span>
                      <span>{saved.durationDays} ימים</span>
                      <span>•</span>
                      <span>{saved.routes.length} מסלולים</span>
                      <span>•</span>
                      <span>
                        {new Date(saved.approvedAt).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedId === saved._id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedId === saved._id && (
              <div className="mt-4 pr-4">
                {saved.routes.map((route, i) => (
                  <RouteCard key={i} route={route} showWeather={true} />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
