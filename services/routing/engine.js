import * as turf from '@turf/turf';
import { sicilyZTLs } from '../../constants/ztl/sicily';

// Funzione di geofencing: verifica se le coordinate sono dentro una ZTL
export const isInZTL = (lat, lng) => {
    const pt = turf.point([lng, lat]);
    return sicilyZTLs.some(ztl => turf.booleanPointInPolygon(pt, ztl));
};

// Algoritmo TSP (Traveling Salesman) con vincoli sul tipo di veicolo
export const optimizeRouteVRP = (startLocation, stops, vehicleType) => {
    let unvisited = [...stops];
    let currentLoc = startLocation;
    let optimizedRoute = [];
    
    while (unvisited.length > 0) {
        // Logica Mezzo: Se 'furgone', le tappe che cadono in ZTL vengono scartate/riprogrammate
        if (vehicleType === 'furgone') {
            unvisited = unvisited.filter(stop => !isInZTL(stop.lat, stop.lng));
        }
        
        if (unvisited.length === 0) break;

        // Trova il nodo più vicino (Nearest Neighbor Algorithm)
        let nearestIndex = 0;
        let minDistance = Infinity;
        
        unvisited.forEach((stop, index) => {
            const from = turf.point([currentLoc.lng, currentLoc.lat]);
            const to = turf.point([stop.lng, stop.lat]);
            // Calcola distanza lineare geospaziale reale
            const dist = turf.distance(from, to, { units: 'kilometers' });
            
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = index;
            }
        });
        
        const nextStop = unvisited[nearestIndex];
        optimizedRoute.push({ ...nextStop, sequence: optimizedRoute.length + 1 });
        currentLoc = nextStop;
        unvisited.splice(nearestIndex, 1);
    }
    
    return optimizedRoute;
};
