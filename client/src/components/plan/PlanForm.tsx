"use client";

import { useState } from "react";

interface PlanFormProps {
  onGenerate: (data: {
    country: string;
    city: string;
    tripType: "trek" | "bicycle";
    durationDays: number;
  }) => void;
  loading: boolean;
}

export default function PlanForm({ onGenerate, loading }: PlanFormProps) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [tripType, setTripType] = useState<"trek" | "bicycle">("trek");
  const [durationDays, setDurationDays] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ country, city, tripType, durationDays });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">תכנון מסלול חדש</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm mb-1">מדינה</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="לדוגמה: Italy"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">עיר / אזור</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="לדוגמה: Tuscany"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">סוג טיול</label>
          <select
            value={tripType}
            onChange={(e) =>
              setTripType(e.target.value as "trek" | "bicycle")
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
          >
            <option value="trek">טרק רגלי</option>
            <option value="bicycle">אופניים</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            משך הטיול (ימים)
          </label>
          <input
            type="number"
            min={1}
            max={7}
            value={durationDays}
            onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
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
            מייצר מסלולים...
          </span>
        ) : (
          "צור מסלול"
        )}
      </button>
    </form>
  );
}
