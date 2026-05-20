'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../../services/supabase/client';
import 'leaflet/dist/leaflet.css';

const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    window.speechSynthesis.speak(utterance);
};

export default function SpeedyMap() {
    const [position, setPosition] = useState({ lat: 38.1156, lng: 13.3612 });

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });

                // Esempio logica vocale: se arrivi vicino a una zona specifica
                if (Math.abs(latitude - 38.1200) < 0.001) {
                    speak("Attenzione, zona ZTL. Verifica il tuo passaggio.");
                }

                await supabase.from('fleet_tracking').upsert({
                    id: (await supabase.auth.getUser()).data.user?.id,
                    lat: latitude,
                    lng: longitude,
                    updated_at: new Date()
                });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '100vh', width: '100vw' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <Marker position={[position.lat, position.lng]} />
        </MapContainer>
    );
}
