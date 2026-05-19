"use client";

export default function LogisticsHUD({ myRole, companyCode, routeInfo, vehicle, setVehicle, handleSignOut, calculateRoute, isLoading, destination }) {
  return (
    <div className="absolute bottom-8 left-4 right-4 z-10 bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-2xl">
      <div className="text-[10px] text-center font-bold tracking-widest text-indigo-400 uppercase mb-2 bg-indigo-950/40 py-1 rounded-md border border-indigo-900/50">
        Ruolo: {myRole} {companyCode && `[${companyCode}]`}
      </div>

      {routeInfo && (
        <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-800/50 p-3 rounded-xl border border-gray-800 text-center">
          <div><span className="text-[10px] text-gray-400 block uppercase tracking-wider">Distanza</span><span className="text-lg font-bold text-white">{routeInfo.distance} km</span></div>
          <div><span className="text-[10px] text-gray-400 block uppercase tracking-wider">Tempo</span><span className="text-lg font-bold text-white">{routeInfo.duration} min</span></div>
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <select className="flex-1 p-3.5 rounded-xl bg-gray-800 text-white outline-none border border-gray-700 text-sm font-medium" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          <option value="driving-car"> Vans / Furgone Aziendale</option>
          <option value="cycling-electric">⚡ Cargo E-Bike</option>
        </select>
        <button onClick={handleSignOut} className="p-3.5 bg-gray-800 text-gray-400 rounded-xl font-bold border border-gray-700 text-xs hover:bg-red-950/30 hover:text-red-400 transition-colors">Esci</button>
      </div>
      
      <button 
        onClick={calculateRoute} 
        disabled={isLoading} 
        className={`w-full p-4 rounded-xl font-bold text-sm transition-all shadow-lg ${!destination ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
      >
        {!destination ? "Tocca la mappa per impostare la rotta" : isLoading ? "Ottimizzazione rotta..." : "Calcola Navigazione Ottimizzata"}
      </button>
    </div>
  );
}
