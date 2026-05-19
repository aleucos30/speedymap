"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-black mb-8 text-blue-500">SpeedyMap</h1>
      <input className="mb-4 p-4 rounded-xl bg-gray-900 border border-white/10 w-full max-w-sm" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="mb-6 p-4 rounded-xl bg-gray-900 border border-white/10 w-full max-w-sm" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      
      <button onClick={handleEmailLogin} className="w-full max-w-sm py-4 bg-blue-600 rounded-xl font-black mb-4">ACCEDI CON EMAIL</button>
      
      <div className="w-full max-w-sm border-t border-white/10 my-4"></div>
      
      <button onClick={handleGoogleLogin} className="w-full max-w-sm py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2">
        <span>Accedi con Google</span>
      </button>
    </div>
  );
}
