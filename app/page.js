"use client";
import { useState } from 'react';
import MapContainer from '@/components/MapContainer';
import LogisticsHUD from '@/components/LogisticsHUD';

export default function SpeedyMapApp() {
  const [vehicle, setVehicle] = useState('driving-car');
  const [isLoading, setIsLoading] = useState(false);

  const calculateRoute = () => {
    setIsLoading(true);
    // Qui aggiungeremo la logica API dopo la conferma della visualizzazione
    setTimeout(() => setIsLoading(false), 1000); 
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <MapContainer viewport={{ longitude: 13.3615, latitude: 38.1157, zoom: 14 }} />
      <LogisticsHUD 
        vehicle={vehicle} 
        setVehicle={setVehicle} 
        calculateRoute={calculateRoute} 
        isLoading={isLoading} 
        destination={true}
        myRole="Corriere"
      />
    </div>
  );
}
