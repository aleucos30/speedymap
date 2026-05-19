"use client";
import MapContainer from '@/components/MapContainer';

export default function SpeedyMapApp() {
  return (
    <div className="relative w-full h-screen bg-black">
      <MapContainer 
        viewport={{ longitude: 13.3615, latitude: 38.1157, zoom: 14 }} 
      />
      <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-white text-xs">
        SpeedyMap: Sistema Online
      </div>
    </div>
  );
}
