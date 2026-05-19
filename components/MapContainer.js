"use client";
import { useRef } from 'react';
import Map, { Marker, Source, Layer, NavigationControl, GeolocateControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapContainer({ 
  viewport, 
  setViewport, 
  userLocation, 
  destination, 
  handleMapClick, 
  dynamicZTL, 
  routeGeoJSON, 
  vehicle 
}) {
  const mapRef = useRef();

  const ztlLayerStyle = {
    id: 'ztl-fill',
    type: 'fill',
    paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.22 }
  };

  const ztlLineStyle = {
    id: 'ztl-line',
    type: 'line',
    paint: { 'line-color': '#ef4444', 'line-width': 2, 'line-dasharray': [2, 2] }
  };

  const routeLayerStyle = {
    id: 'route',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 
      'line-color': vehicle === 'cycling-electric' ? '#10b981' : '#3b82f6', 
      'line-width': 5 
    }
  };

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      {...viewport}
      onMove={evt => setViewport(evt.viewState)}
      onClick={handleMapClick}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
      <NavigationControl position="top-right" showCompass={false} />
      <GeolocateControl position="top-right" trackUserLocation showUserLocation />

      {dynamicZTL && (
        <Source id="ztl-source" type="geojson" data={dynamicZTL}>
          <Layer {...ztlLayerStyle} />
          <Layer {...ztlLineStyle} />
        </Source>
      )}

      {routeGeoJSON && (
        <Source id="route-source" type="geojson" data={routeGeoJSON}>
          <Layer {...routeLayerStyle} />
        </Source>
      )}

      {userLocation && (
        <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white ring-4 ring-blue-500/30" />
        </Marker>
      )}

      {destination && (
        <Marker longitude={destination[0]} latitude={destination[1]}>
          <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white font-bold">🎯</div>
        </Marker>
      )}
    </Map>
  );
}
