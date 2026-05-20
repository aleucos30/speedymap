export const getDirection = (start: {lat: number, lng: number}, end: {lat: number, lng: number}) => {
    const y = end.lat - start.lat;
    const x = end.lng - start.lng;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    
    // Semplificazione: Nord/Sud/Est/Ovest
    if (angle > -45 && angle <= 45) return "svolta a destra";
    if (angle > 45 && angle <= 135) return "svolta a nord";
    if (angle > -135 && angle <= -45) return "svolta a sud";
    return "svolta a sinistra";
};
