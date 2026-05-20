'use client';
import { useState } from 'react';

export default function NavButton({ targetStop }: { targetStop: any }) {
  const startNavigation = () => {
    if (!targetStop) {
      alert("Seleziona prima una tappa!");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      
      // Corretto: URL racchiuso tra backtick (template literal)
      const url = \https://www.google.com/maps/dir/?api=1&origin=\,\&destination=\,\&travelmode=driving\;
      
      window.open(url, '_blank');
    }, (err) => {
      alert("Errore GPS: Assicurati di aver dato i permessi di localizzazione.");
    });
  };

  return (
    <button 
      onClick={startNavigation}
      style={{ background: '#f59e0b', padding: '15px', borderRadius: '10px', color: 'black', fontWeight: 'bold', width: '100%', border: 'none', marginTop: '10px' }}
    >
      AVVIA NAVIGAZIONE LIVE
    </button>
  );
}
