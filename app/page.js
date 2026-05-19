"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LoginScreen from '@/components/LoginScreen';
import MapContainer from '@/components/MapContainer';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function SpeedyMapApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Caricamento in corso...</div>;

  return (
    <div className="relative w-full h-screen bg-black">
      {!session ? (
        <LoginScreen />
      ) : (
        <MapContainer viewport={{ longitude: 13.3615, latitude: 38.1157, zoom: 14 }} />
      )}
    </div>
  );
}
