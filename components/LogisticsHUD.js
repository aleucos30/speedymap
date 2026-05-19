"use client";

export default function LogisticsHUD() {
  return (
    <div className="absolute bottom-6 left-4 right-4 z-10">
      <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl">
        <button className="w-full py-4 bg-blue-600 rounded-2xl font-black text-white">
          Avvia Navigazione
        </button>
      </div>
    </div>
  );
}
