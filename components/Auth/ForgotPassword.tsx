'use client';
import { useState } from 'react';
import { supabase } from '../../services/supabase/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://speedymap-tuo-progetto.vercel.app/update-password',
    });
    if (error) setMessage('Errore: ' + error.message);
    else setMessage('Controlla la tua email per il link di reset.');
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <input 
        type="email" 
        placeholder="La tua email" 
        onChange={(e) => setEmail(e.target.value)}
        className="text-black p-2 rounded"
      />
      <button onClick={handleReset} className="ml-2 bg-blue-600 p-2 rounded">
        Reset Password
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
