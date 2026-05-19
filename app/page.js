"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// 1. Inizializzazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SpeedyMapApp() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Stati Mappa e Routing
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [vehicle, setVehicle] = useState('cycling-electric'); 
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Coordinate di test: Teatro Massimo -> Stazione Centrale
  const startCoords = [13.3572, 38.1202];
  const endCoords = [13.3667, 38.1105];

  // Controlla se c'è già una sessione attiva al caricamento
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Funzione di Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert("Errore: " + error.message);
  };

  // 3. Funzione Calcolo Percorso (ORS)
  const calculateRoute = async () => {
    setIsLoadingRoute(true);
    const url = `https://api.openrouteservice.org/v2/directions/${vehicle}?api_key=${process.env.NEXT_PUBLIC_ORS_KEY}&start=${startCoords[0]},${startCoords[1]}&end=${endCoords[0]},${endCoords[1]}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const coords = data.features[0].geometry.coordinates;
      
      setRouteGeoJSON({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords }
      });
    } catch (error) {
      console.error("Errore routing:", error);
      alert("Errore nel calcolo del percorso.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Stile della linea del navigatore
  const routeLayerStyle = {
    id: 'route',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.8 }
  };

  // === RENDER SCHERMATA LOGIN ===
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-2">SpeedyMap</h1>
        <p className="text-gray-400 mb-8">Ottimizza la tua logistica urbana</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-2xl shadow-xl">
          <input 
            type="email" 
            placeholder="Email" 
            required
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full p-3 bg-blue-600 rounded font-bold hover:bg-blue-500 transition-colors">
            Accedi
          </button>
        </form>
      </div>
    );
  }

  // === RENDER SCHERMATA MAPPA ===
  return (
    <div className="relative w-full h-screen bg-black">
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: 13.3615,
          latitude: 38.1157,
          zoom: 14
        }}
        style={{width: '100%', height: '100%'}}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        <Marker longitude={startCoords[0]} latitude={startCoords[1]} anchor="bottom">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
        </Marker>
        <Marker longitude={endCoords[0]} latitude={endCoords[1]} anchor="bottom">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
        </Marker>

        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}
      </Map>

      {/* Pannello Controlli in basso */}
      <div className="absolute bottom-10 left-4 right-4 z-10 bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-800">
        <div className="flex gap-2 mb-4">
          <select 
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          >
            <option value="cycling-electric">E-Bike / Bici</option>
            <option value="driving-car">Furgone / Auto</option>
          </select>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="p-3 bg-red-900/50 text-red-400 rounded-lg font-bold border border-red-900"
          >
            Esci
          </button>
        </div>
        
        <button 
          onClick={calculateRoute}
          disabled={isLoadingRoute}
          className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
        >
          {isLoadingRoute ? "Calcolo in corso..." : "Ottimizza Percorso"}
        </button>
      </div>
    </div>
  );
}