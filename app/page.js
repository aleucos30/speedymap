"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Inizializzazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Poligono approssimativo della ZTL Centrale di Palermo (ZTL 1)
// Delimitata da: Via Cavour, Via Lincoln, Foro Italico, Via Volturno/Carini
const palermoZTLGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [13.3537, 38.1205], // Via Cavour / Via Maqueda
      [13.3642, 38.1215], // Via Cavour / Piazza 13 Vittime
      [13.3710, 38.1190], // Foro Italico
      [13.3685, 38.1100], // Via Lincoln / Stazione Centrale
      [13.3540, 38.1115], // Corso Tukory
      [13.3510, 38.1170], // Via Volturno / Teatro Massimo
      [13.3537, 38.1205]  // Chiusura poligono
    ]]
  }
};

export default function SpeedyMapApp() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Stati Mappa, Routing e Radar
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [vehicle, setVehicle] = useState('driving-car'); // Partiamo con Furgone per testare il radar
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [ztlAlert, setZtlAlert] = useState(false);

  // Coordinate di test: Esterno (Teatro Politeama) -> Interno ZTL (Stazione Centrale)
  const startCoords = [13.3562, 38.1270]; 
  const endCoords = [13.3667, 38.1105];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Errore: " + error.message);
  };

  // Calcolo percorso + Controllo Radar ZTL
  const calculateRoute = async () => {
    setIsLoadingRoute(true);
    setZtlAlert(false); // Reset allerta

    const url = `https://api.openrouteservice.org/v2/directions/${vehicle}?api_key=${process.env.NEXT_PUBLIC_ORS_KEY}&start=${startCoords[0]},${startCoords[1]}&end=${endCoords[0]},${endCoords[1]}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        alert("Impossibile trovare un percorso.");
        return;
      }

      const coords = data.features[0].geometry.coordinates;
      
      setRouteGeoJSON({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords }
      });

      // Logica del Radar: Se il mezzo è un furgone (driving-car), simuliamo il controllo incrociato sulla ZTL
      if (vehicle === 'driving-car') {
        // Un vero algoritmo controllerebbe l'intersezione geometrica (es. con @turf/boolean-intersects)
        // Per il prototipo v0, attiviamo l'allerta se la destinazione o il percorso entra nell'area centrale
        setZtlAlert(true);
      }

    } catch (error) {
      console.error("Errore routing:", error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Stili grafici per la mappa open source
  const ztlLayerStyle = {
    id: 'ztl-area',
    type: 'fill',
    paint: {
      'fill-color': '#ef4444', // Rosso
      'fill-opacity': 0.25
    }
  };

  const ztlLineStyle = {
    id: 'ztl-line',
    type: 'line',
    paint: {
      'line-color': '#ef4444',
      'line-width': 2,
      'line-dasharray': [2, 2]
    }
  };

  const routeLayerStyle = {
    id: 'route',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.9 }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-2">SpeedyMap</h1>
        <p className="text-gray-400 mb-8">Ottimizza la tua logistica urbana</p>
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-2xl">
          <input type="email" placeholder="Email" required className="w-full p-3 rounded bg-gray-700 text-white outline-none" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full p-3 rounded bg-gray-700 text-white outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full p-3 bg-blue-600 rounded font-bold">Accedi</button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <Map
        mapLib={maplibregl}
        initialViewState={{ longitude: 13.3615, latitude: 38.1157, zoom: 13.5 }}
        style={{width: '100%', height: '100%'}}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        {/* Layer della ZTL di Palermo */}
        <Source id="ztl-source" type="geojson" data={palermoZTLGeoJSON}>
          <Layer {...ztlLayerStyle} />
          <Layer {...ztlLineStyle} />
        </Source>

        {/* Percorso di Navigazione */}
        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}

        <Marker longitude={startCoords[0]} latitude={startCoords[1]}><div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white" /></Marker>
        <Marker longitude={endCoords[0]} latitude={endCoords[1]}><div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white" /></Marker>
      </Map>

      {/* ZTL Radar Alert Banner */}
      {ztlAlert && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-950/90 backdrop-blur-md border border-red-500 p-4 rounded-xl shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="text-red-400 font-bold text-sm">ZTL RADAR: RILEVATO INGRESSO</h4>
              <p className="text-gray-300 text-xs">Il percorso attraversa la ZTL centrale. Mezzo non autorizzato o pass richiesto.</p>
            </div>
          </div>
        </div>
      )}

      {/* Pannello Controlli */}
      <div className="absolute bottom-10 left-4 right-4 z-10 bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-800">
        <div className="flex gap-2 mb-4">
          <select 
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          >
            <option value="driving-car">Furgone / Van</option>
            <option value="cycling-electric">E-Bike / Mezzo Elettrico</option>
          </select>
          <button onClick={() => supabase.auth.signOut()} className="p-3 bg-red-900/50 text-red-400 rounded-lg font-bold border border-red-900 text-xs">Esci</button>
        </div>
        
        <button 
          onClick={calculateRoute}
          disabled={isLoadingRoute}
          className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
        >
          {isLoadingRoute ? "Calcolo rotta..." : "Ottimizza Percorso"}
        </button>
      </div>
    </div>
  );
}