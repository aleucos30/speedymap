'use client';
import { useState, useEffect } from 'react';

export default function VoiceNavigator({ currentLoc, nextStop }: { currentLoc: any, nextStop: any }) {
    const [instruction, setInstruction] = useState('In attesa di percorso...');

    useEffect(() => {
        if (!nextStop || !currentLoc) return;

        const latDiff = nextStop.lat - currentLoc.lat;
        const lngDiff = nextStop.lng - currentLoc.lng;
        const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000;
        
        if (dist < 500) {
            const dir = latDiff > 0 ? 'Nord' : 'Sud';
            const distRounded = Math.round(dist);
            const text = "Svolta a " + dir + " tra " + distRounded + " metri";
            
            setInstruction(text);
            
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'it-IT';
            window.speechSynthesis.speak(msg);
        }
    }, [currentLoc, nextStop]);

    return (
        <div style={{ 
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', 
            zIndex: 1000, background: 'rgba(0,0,0,0.7)', padding: '10px 20px', 
            borderRadius: '20px', color: '#00ff00', fontWeight: 'bold', backdropFilter: 'blur(5px)' 
        }}>
            {instruction}
        </div>
    );
}
