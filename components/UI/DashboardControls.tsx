'use client';
import { useState } from 'react';
import { supabase } from '../../services/supabase/client';

export default function DashboardControls() {
  const addStop = async () => {
    console.log("Tentativo di inserimento...");
    const { data, error } = await supabase.from('stops').insert([{
      address: 'Test Debug',
      lat: 0,
      lng: 0
    }]);
    
    if (error) {
      console.error("ERRORE SUPABASE:", error);
      alert('Errore: ' + error.message);
    } else {
      alert('Tappa aggiunta con successo!');
    }
  };

  return <button onClick={addStop} style={{padding:'20px', background:'red'}}>TEST INSERIMENTO</button>;
}
