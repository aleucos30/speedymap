"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!email || !password) {
      alert("Inserisci sia l'email che la password!");
      return;
    }
    
    setLoading(true);
    
    if (isRegistering) {
      // 1. Logica di Registrazione Pulita
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        alert("Errore registrazione: " + error.message);
      } else if (data?.session) {
        // Se Supabase lo logga direttamente dopo la registrazione
        window.location.reload();
      } else {
        // Se non lo logga in automatico, forziamo l'accesso immediato
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) alert("Registrato! Ora inserisci le credenziali per accedere.");
        else window.location.reload();
      }
    } else {
      // 2. Logica di Accesso
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Errore accesso: " + error.message);
      else window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-black mb-8 text-blue-500 tracking-wider animate-pulse">SpeedyMap</h1>
      
      <div className="w-full max-w-sm space-y-4">
        <input 
          className="p-4 rounded-xl bg-gray-900 border border-white/10 w-full focus:outline-none focus:border-blue-500 transition-colors" 
          type="email" 
          placeholder="Email Aziendale o Corriere" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="p-4 rounded-xl bg-gray-900 border border-white/10 w-full focus:outline-none focus:border-blue-500 transition-colors" 
          type="password" 
          placeholder="Password (min. 6 caratteri)" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <button 
          onClick={handleAction} 
          disabled={loading} 
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-xl font-black transition-colors shadow-lg shadow-blue-600/20"
        >
          {loading ? 'ELABORAZIONE...' : (isRegistering ? 'REGISTRATI ORA' : 'ACCEDI')}
        </button>

        <div className="text-center pt-2">
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-gray-400 hover:text-white text-sm underline transition-colors"
          >
            {isRegistering ? 'Hai già un account? Accedi' : 'Nuovo corriere? Registrati qui'}
          </button>
        </div>
      </div>
    </div>
  );
}
