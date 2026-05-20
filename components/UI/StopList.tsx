'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase/client';

export default function StopList() {
  const [stops, setStops] = useState<any[]>([]);

  const fetchStops = async () => {
    const { data } = await supabase
      .from('stops')
      .select('*')
      .eq('status', 'pending')
      .order('sequence_order', { ascending: true });
    if (data) setStops(data);
  };

  useEffect(() => {
    fetchStops();
    // Aggiorna la lista ogni 5 secondi per vedere i cambi di ordine
    const interval = setInterval(fetchStops, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '10px', background: '#333', color: '#fff', borderRadius: '8px' }}>
      <h4>Prossime tappe:</h4>
      {stops.map((stop, index) => (
        <div key={stop.id} style={{ borderBottom: '1px solid #555', padding: '5px 0' }}>
          {index + 1}. {stop.address}
        </div>
      ))}
    </div>
  );
}
