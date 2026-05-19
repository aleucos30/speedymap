"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Errore Login Google:", err);
      alert("Errore di connessione a Google. Verifica la configurazione su Supabase.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-black mb-8 text-blue-500">SpeedyMap</h1>
      <button onClick={handleGoogleLogin} className="w-full max-w-sm py-4 bg-white text-black rounded-xl font-bold">
        Accedi con Google (Debug Mode)
      </button>
    </div>
  );
}
