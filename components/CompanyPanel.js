"use client";

export default function CompanyPanel({ companyCode, drivers, selectedDriver, setSelectedDriver, msgText, setMsgText, sendMessage }) {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-800 text-xs text-white max-h-48 overflow-y-auto">
      <h3 className="font-bold text-amber-400 uppercase tracking-wider mb-2">Pannello Controllo Flotta ({companyCode})</h3>
      <div className="space-y-2">
        {drivers.map(d => (
          <div key={d.id} className={`p-2 rounded border transition-colors ${selectedDriver?.id === d.id ? 'bg-amber-600/20 border-amber-500' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex justify-between items-center">
              <span>{d.email}</span>
              <button onClick={() => setSelectedDriver(d)} className="bg-amber-600 text-black font-bold px-2 py-0.5 rounded text-[10px]">Traccia & Scrivi</button>
            </div>
            {selectedDriver?.id === d.id && (
              <div className="mt-2 flex gap-1">
                <input type="text" placeholder="Disposizione o nota consegna..." value={msgText} onChange={e => setMsgText(e.target.value)} className="flex-1 bg-black border border-gray-700 p-1 text-white rounded text-[11px] outline-none" />
                <button onClick={sendMessage} className="bg-blue-600 text-white px-2 rounded font-bold">Invia</button>
              </div>
            )}
          </div>
        ))}
        {drivers.length === 0 && <p className="text-gray-500 italic">Nessun dipendente registrato con il tuo codice.</p>}
      </div>
    </div>
  );
}
