"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import MapContainer from '@/components/MapContainer';
import LoginScreen from '@/components/LoginScreen';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function SpeedyMapApp() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Stati logistica
  const [viewport, setViewport] = useState({ longitude: 13.3615, latitude: 38.1157, zoom: 14 });
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [vehicle, setVehicle] = useState('driving-car');
  const [dynamicZTL, setDynamicZTL] = useState(null);
  const [ztlAlert, setZtlAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);

        if (!userLocation) {
          setViewport((prev) => ({ ...prev, longitude, latitude }));
          fetchLocalZTL(longitude, latitude);
        }
      },
      (error) => console.error("Errore GPS:", error),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [session]);

  const fetchLocalZTL = async (lon, lat) => {
    try {
      const res = await fetch(https://nominatim.openstreetmap.org/reverse?format=json&lat=\&lon=\);
      const data = await res.json();
      const city = data.address.city || data.address.town;
      
      if (city) {
        const { data: ztlData } = await supabase.from('ztl_zones').select('geometry').eq('city_name', city).single();
        if (ztlData) setDynamicZTL({ type: 'Feature', geometry: ztlData.geometry });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMapClick = (event) => {
    const { lngLat } = event;
    setDestination([lngLat.lng, lngLat.lat]);
    setRouteGeoJSON(null);
    setRouteInfo(null);
    setZtlAlert(false);
  };

  const calculateRoute = async () => {
    if (!userLocation || !destination) return;
    setIsLoading(true);
    setZtlAlert(false);

    const url = https://api.openrouteservice.org/v2/directions/\?api_key=\&start=\,\&end=\,\;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        setRouteGeoJSON({ type: 'Feature', properties: {}, geometry: feature.geometry });
        setRouteInfo({
          distance: (feature.properties.summary.distance / 1000).toFixed(2),
          duration: Math.round(feature.properties.summary.duration / 60)
        });

        if (vehicle === 'driving-car' && dynamicZTL) {
          setZtlAlert(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ACCESSO
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Errore di accesso: " + error.message);
    setAuthLoading(false);
  };

  // REGISTRAZIONE AVANZATA CON METADATI DI RUOLO
  const handleRegister = async (e, role) => {
    e.preventDefault();
    setAuthLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role, // Salviamo il ruolo direttamente nell'utente!
        }
      }
    });

    if (error) {
      alert("Errore di registrazione: " + error.message);
    } else {
      alert("Registrazione completata! Verifica la tua email o accedi.");
    }
    setAuthLoading(false);
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window?.location?.origin || '' },
    });
    if (error) alert("Errore: " + error.message);
    setAuthLoading(false);
  };

  if (!session) {
    return (
      <LoginScreen 
        email={email}
        setEmail={setEmail}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        authLoading={authLoading}
        handleGoogleLogin={handleGoogleLogin}
      />
    );
  }

  // Estraiamo il ruolo dell'utente correntemente loggato per scopi futuri
  const userMetadataRole = session.user.user_metadata?.role === 'azienda' ? 'azienda' : (session.user.user_metadata?.role || 'privato');

  return (
    <div className="relative w-full h-screen bg-black">
      <MapContainer 
        viewport={viewport}
        setViewport={setViewport}
        userLocation={userLocation}
        destination={destination}
        handleMapClick={handleMapClick}
        dynamicZTL={dynamicZTL}
        routeGeoJSON={routeGeoJSON}
        vehicle={vehicle}
      />

      {/* Banner Allerta Radar */}
      {ztlAlert && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-950/95 backdrop-blur-md border border-red-500/50 p-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-xl">??</span>
            <div>
              <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider">ZTL Radar Detection</h4>
              <p className="text-gray-300 text-xs mt-0.5">Destinazione all'interno della ZTL commerciale attiva. Verifica autorizzazioni furgone.</p>
            </div>
          </div>
        </div>
      )}

      {/* Interfaccia Utente Logistica */}
      <div className="absolute bottom-8 left-4 right-4 z-10 bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-2xl">
        
        {/* Badge in alto che mostra il tipo di profilo caricato */}
        <div className="text-[10px] text-center font-bold tracking-widest text-indigo-400 uppercase mb-2 bg-indigo-950/40 py-1 rounded-md border border-indigo-900/50">
          Profilo Attivo: {userMetadataRole}
        </div>

        {routeInfo && (
          <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-800/50 p-3 rounded-xl border border-gray-800 text-center">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Distanza</span>
              <span className="text-lg font-bold text-white">{routeInfo.distance} km</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Tempo Stimato</span>
              <span className="text-lg font-bold text-white">{routeInfo.duration} min</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <select className="flex-1 p-3.5 rounded-xl bg-gray-800 text-white outline-none border border-gray-700 text-sm font-medium" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            <option value="driving-car"> Vans / Furgone Aziendale</option>
            <option value="cycling-electric">? Cargo E-Bike</option>
          </select>
          <button onClick={() => supabase.auth.signOut()} className="p-3.5 bg-gray-800 text-gray-400 rounded-xl font-bold border border-gray-700 text-xs">Esci</button>
        </div>
        
        <button 
          onClick={calculateRoute}
          disabled={isLoading}
          className={w-full p-4 rounded-xl font-bold text-sm transition-all shadow-lg \}
        >
          {!destination ? "Tocca la mappa per impostare la consegna" : isLoading ? "Ottimizzazione rotta..." : "Calcola Navigazione Ottimizzata"}
        </button>
      </div>
    </div>
  );
}
