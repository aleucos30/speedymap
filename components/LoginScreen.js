"use client";
import { useState } from 'react';

export default function LoginScreen({ 
  email, 
  setEmail, 
  setPassword, 
  handleLogin, 
  handleRegister, 
  handleGoogleLogin, 
  authLoading 
}) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState('privato'); // privato o dipendente

  const onSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      handleRegister(e, userRole);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          SpeedyMap
        </h1>
        <p className="text-gray-400 text-sm mt-2">Logistica Urbana Intelligente & Radar ZTL</p>
      </div>

      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-2xl space-y-5">
        
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-700">
          <button 
            type="button"
            onClick={() => setIsRegistering(false)} 
            className={lex-1 py-2 text-xs font-bold rounded-lg transition-all \}
          >
            ACCEDI
          </button>
          <button 
            type="button"
            onClick={() => setIsRegistering(true)} 
            className={lex-1 py-2 text-xs font-bold rounded-lg transition-all \}
          >
            REGISTRATI
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" placeholder="nome@esempio.it" required className="w-full p-3.5 rounded-xl bg-gray-900/80 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Password</label>
            <input type="password" placeholder="••••••••" required className="w-full p-3.5 rounded-xl bg-gray-900/80 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm" onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* Scelta Ruolo protetta: Esclusa l'Azienda dall'autoregistrazione */}
          {isRegistering && (
            <div className="space-y-2 animate-fadeIn">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Tipo di Profilo</label>
              <div className="grid grid-cols-2 gap-2">
                {['privato', 'dipendente'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUserRole(role)}
                    className={p-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all \}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 text-center mt-1 italic">
                {userRole === 'privato' && "✓ Account per rider autonomi e corrieri singoli."}
                {userRole === 'dipendente' && "✓ Collegati alla tua azienda per ricevere i percorsi."}
              </p>
              <p className="text-[10px] text-center text-amber-500/80 mt-2 bg-amber-950/20 py-1.5 rounded-lg border border-amber-900/30">
                Sei un'azienda di logistica? <br/> Contattaci per l'attivazione manuale della dashboard flotta.
              </p>
            </div>
          )}
          
          <button type="submit" disabled={authLoading} className="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-colors shadow-lg disabled:opacity-50">
            {authLoading ? "Elaborazione..." : isRegistering ? "Crea Account" : "Accedi con Email"}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider font-medium">oppure</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button onClick={handleGoogleLogin} disabled={authLoading} className="w-full p-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-50">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.56 1.63 14.99 1 12 1 7.35 1 3.39 3.65 1.42 7.54l3.79 2.94C6.11 7.27 8.84 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.45 12.3c0-.82-.07-1.6-.2-2.3H12v4.38h6.42c-.28 1.44-1.1 2.66-2.33 3.48l3.61 2.81c2.11-1.95 3.35-4.82 3.35-8.37z"/>
            <path fill="#FBBC05" d="M5.21 14.6c-.22-.66-.35-1.37-.35-2.1s.13-1.44.35-2.1L1.42 7.46C.51 9.27 0 11.28 0 13.4s.51 4.13 1.42 5.94l3.79-2.74z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.61-2.81c-.99.66-2.27 1.06-4.35 1.06-3.16 0-5.89-2.23-6.85-5.44L1.36 16.64C3.33 20.47 7.3 23 12 23z"/>
          </svg>
          Continua con Google
        </button>
      </div>
    </div>
  );
}
