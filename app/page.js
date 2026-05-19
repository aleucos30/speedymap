"use client";
import { useState, useEffect } from 'react';
import LoginScreen from '@/components/LoginScreen';

export default function SpeedyMapApp() {
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="text-white">Caricamento...</div>;

  try {
    return (
      <div className="relative w-full h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">SpeedyMap</h1>
        <LoginScreen />
      </div>
    );
  } catch (err) {
    return <div className="p-10 text-red-500">ERRORE: {err.message}</div>;
  }
}
