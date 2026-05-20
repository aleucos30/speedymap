export const calculateRoute = (vehicleType, locations) => {
    // Logica di routing:
    // Se Furgone -> Escludi ZTL (Palermo, Catania, Messina)
    // Se Auto -> Accesso consentito
    const isZtl = (lat, lng) => { 
        /* Qui andrà il controllo coordinate ZTL */ 
        return true; 
    };

    return locations.map(loc => ({
        ...loc,
        allowed: vehicleType === 'furgone' ? !isZtl(loc.lat, loc.lng) : true
    }));
};
