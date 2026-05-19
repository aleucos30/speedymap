"use client";

export default function LogisticsHUD({ 
  myRole, 
  companyCode, 
  routeInfo, 
  vehicle, 
  setVehicle, 
  handleSignOut, 
  calculateRoute, 
  isLoading, 
  destination 
}) {
  return (
    <div className="absolute bottom-6 left-4 right-4 z-10">
      <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl">
        
        {/* Badge Ruolo */}
        <div className="text-[9px] text-center font-black tracking-[0.2em] text-blue-400 uppercase mb-4 bg-blue-950/30 py-1 rounded-full border border-blue-900/50">
          {myRole} {companyCode && \• \\}
        </div>

        {/* Info Percorso */}
        {routeInfo && (
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Distanza</p>
              <p className="text-xl font-black text-white">{routeInfo.distance} km</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Tempo</p>
              <p className="text-xl font-black text-blue-400">{routeInfo.duration} min</p>
            </div>
          </div>
        )}

        {/* Azione Principale */}
        <button 
          onClick={calculateRoute} 
          disabled={isLoading} 
          className={w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg \}
        >
          {isLoading ? "Calcolo in corso..." : !destination ? "Tocca la mappa per la rotta" : "Avvia Navigazione"}
        </button>

        {/* Footer: Veicolo ed Esci */}
        <div className="mt-4 flex gap-2">
          <select 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-[11px] font-bold outline-none" 
            value={vehicle} 
            onChange={(e) => setVehicle(e.target.value)}
          >
            <option value="driving-car">🚐 Furgone Aziendale</option>
            <option value="cycling-electric">⚡ Cargo E-Bike</option>
          </select>
          <button 
            onClick={handleSignOut} 
            className="px-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-[11px] font-bold"
          >
            Esci
          </button>
        </div>
      </div>
    </div>
  );
}
