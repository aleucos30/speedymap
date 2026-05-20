'use client';
import dynamic from 'next/dynamic';

const DynamicSpeedyMap = dynamic(() => import('./Map/SpeedyMap'), {
    ssr: false,
    loading: () => (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Inizializzazione Motore Geospaziale...</h2>
            <p>Caricamento mappe reali e calcolo rotte ZTL in corso.</p>
        </div>
    )
});

export default function MapComponent(props) {
    return <DynamicSpeedyMap {...props} />;
}
