"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-blue-200">
          מסלול טיולים אפקה 2026
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/plan" className="hover:text-blue-200 transition">
            תכנון מסלולים
          </Link>
          <Link href="/history" className="hover:text-blue-200 transition">
            היסטוריה
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-blue-200 text-sm">שלום, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition"
              >
                התנתק
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition"
            >
              התחבר
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
