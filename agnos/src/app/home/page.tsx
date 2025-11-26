"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
          AGNOS Realtime System
        </h1>

        <p className="text-gray-600 mb-6">
          Please select your interface:
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/patient-form"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm"
          >
            Patient Form
          </Link>

          <Link
            href="/staff-view"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded text-sm"
          >
            Staff View
          </Link>
        </div>
      </div>
    </div>
  );
}
