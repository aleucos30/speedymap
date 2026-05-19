"use client";

export default function LogisticsHUD({ vehicle, setVehicle, calculateRoute, isLoading, destination, myRole }) {
  return (
    <div className="absolute bottom-6 left-4 right-4 z-10 bg-gray-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl">
      <div className="text-[9px] text-center font-black tracking-[0.2em] text-blue-400 uppercase mb-4">
        {myRole}
      </div>
      
      <button 
        onClick={calculateRoute} 
        disabled={isLoading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white transition-all shadow-lg mb-4"
      >
        {isLoading ? "Ottimizzazione..." : "Avvia Navigazione"}
      </button>

      <select 
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-[11px] font-bold outline-none" 
        value={vehicle} 
        onChange={(e) => setVehicle(e.target.value)}
      >
        <option value="driving-car">🚐 Furgone Aziendale</option>
        <option value="cycling-electric">⚡ Cargo E-Bike</option>
      </select>
    </div>
  );
}
