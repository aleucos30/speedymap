'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase/client';
import LoginForm from '../components/Auth/LoginForm';
import DashboardControls from '../components/UI/DashboardControls';

// Disabilitiamo SSR per Leaflet (obbligatorio in Next.js)
const SpeedyMap = dynamic(() => import('../components/Map/SpeedyMap'), { 
    ssr: false,
    loading: () => <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'white'}}>Caricamento Motore GPS...</div>
});

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controllo stato al primo caricamento
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Ascolto in tempo reale dei cambiamenti (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Finché controlla la sessione, non mostra nulla (evita sfarfallii)
  if (loading) return null;

  // Se non c'è sessione, mostra il modulo di Login pulito
  if (!session) {
    return <LoginForm />;
  }

  // Se loggato, mostra l'app principale
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <DashboardControls />
      <SpeedyMap />
    </div>
  );
}
