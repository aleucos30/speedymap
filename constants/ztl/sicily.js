import { polygon } from '@turf/turf';

// Coordinate ZTL Palermo Centro Storico
export const palermoZTL = polygon([[
    [13.3510, 38.1210],
    [13.3690, 38.1210],
    [13.3690, 38.1090],
    [13.3510, 38.1090],
    [13.3510, 38.1210]
]]);

// Coordinate ZTL Catania Centro
export const cataniaZTL = polygon([[
    [15.0800, 37.5080],
    [15.0950, 37.5080],
    [15.0950, 37.4980],
    [15.0800, 37.4980],
    [15.0800, 37.5080]
]]);

export const sicilyZTLs = [palermoZTL, cataniaZTL];
