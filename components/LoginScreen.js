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
    setLoading(true);
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Registrazione completata! Controlla la tua email per confermare.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-black mb-8 text-blue-500">SpeedyMap</h1>
      
      <input className="mb-4 p-4 rounded-xl bg-gray-900 border border-white/10 w-full max-w-sm" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="mb-6 p-4 rounded-xl bg-gray-900 border border-white/10 w-full max-w-sm" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      
      <button onClick={handleAction} disabled={loading} className="w-full max-w-sm py-4 bg-blue-600 rounded-xl font-black mb-4">
        {loading ? 'Attendere...' : (isRegistering ? 'REGISTRATI' : 'ACCEDI')}
      </button>

      <button onClick={() => setIsRegistering(!isRegistering)} className="text-gray-400 text-sm underline">
        {isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
      </button>
    </div>
  );
}
