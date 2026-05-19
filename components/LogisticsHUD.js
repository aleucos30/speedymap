"use client";

export default function LogisticsHUD({ myRole, companyCode, routeInfo, vehicle, setVehicle, handleSignOut, calculateRoute, isLoading, destination }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl">
        
        {/* Info Percorso (più leggibile) */}
        {routeInfo && (
          <div className="flex justify-around mb-5">
            <div className="text-center">
              <p className="text-[10px] uppercase text-white/50 font-bold tracking-widest">Distanza</p>
              <p className="text-xl font-black text-white">{routeInfo.distance} km</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-white/50 font-bold tracking-widest">Tempo</p>
              <p className="text-xl font-black text-blue-400">{routeInfo.duration} min</p>
            </div>
          </div>
        )}

        {/* Bottone principale (CTA) */}
        <button 
          onClick={calculateRoute} 
          disabled={isLoading} 
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          {isLoading ? "Calcolo in corso..." : !destination ? "Seleziona destinazione" : "Vai a destinazione"}
        </button>

        {/* Impostazioni (più sottili) */}
        <div className="mt-4 flex gap-2">
          <select className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-bold" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            <option value="driving-car">🚐 Furgone</option>
            <option value="cycling-electric">⚡ E-Bike</option>
          </select>
          <button onClick={handleSignOut} className="px-4 bg-white/5 border border-white/10 rounded-xl text-white/50 text-xs">Esci</button>
        </div>
      </div>
    </div>
  );
}
