'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../services/supabase/client';

// Caricamento dinamico: Leaflet non verrà toccato dal server durante il build
const MapWithNoSSR = dynamic(() => import('react-leaflet').then(mod => {
    const { MapContainer, TileLayer, Marker, Popup } = mod;
    return function Map({ fleet }: { fleet: any[] }) {
        return (
            <MapContainer center={[38.1156, 13.3612]} zoom={12} style={{ height: '100vh', width: '100vw' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                {fleet.map((f) => (
                    <Marker key={f.id} position={[f.lat, f.lng]}>
                        <Popup>Furgone ID: {f.id.substring(0,6)}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        );
    };
}), { ssr: false, loading: () => <p>Caricamento Radar...</p> });

export default function AdminRadar() {
    const [fleet, setFleet] = useState<any[]>([]);

    useEffect(() => {
        const fetchFleet = async () => {
            const { data } = await supabase.from('fleet_tracking').select('*');
            if (data) setFleet(data);
        };
        fetchFleet();

        const channel = supabase.channel('fleet_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet_tracking' }, 
            () => fetchFleet()).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return <MapWithNoSSR fleet={fleet} />;
}
