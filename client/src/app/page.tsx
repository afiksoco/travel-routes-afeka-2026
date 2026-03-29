import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
        מסלול טיולים אפקה 2026
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center max-w-xl">
        תכננו מסלולי טיולים מותאמים אישית בעזרת בינה מלאכותית, עם מפות
        אינטראקטיביות ותחזית מזג אוויר
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/plan"
          className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
        >
          <div className="text-4xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            תכנון מסלולים
          </h2>
          <p className="text-gray-500 text-sm">
            צרו מסלולי טיול חדשים עם מפות ותחזית מזג אוויר
          </p>
        </Link>
        <Link
          href="/history"
          className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
        >
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            היסטוריית מסלולים
          </h2>
          <p className="text-gray-500 text-sm">
            צפו במסלולים שתכננתם בעבר עם תחזית מעודכנת
          </p>
        </Link>
      </div>
    </div>
  );
}
