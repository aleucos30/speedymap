"use client";

export default function DriverBanner({ incomingMsg, setIncomingMsg }) {
  return (
    <div className="absolute top-4 left-4 right-4 z-30 bg-indigo-950/95 border border-indigo-500 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
      <h4 className="text-xs font-bold text-indigo-400 tracking-wider">🔔 DISPOSIZIONE DALLA CENTRALE:</h4>
      <p className="text-white text-sm font-semibold mt-1">"{incomingMsg}"</p>
      <button onClick={() => setIncomingMsg(null)} className="mt-2 text-[10px] bg-indigo-900 px-3 py-1 rounded-lg text-gray-300 font-bold border border-indigo-700">Ho letto</button>
    </div>
  );
}
