'use client';
import { useState } from 'react';
import { supabase } from '../../services/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage('Errore: ' + error.message);
      else setMessage('Registrazione completata! Verifica la tua email.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage('Errore: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#121212', color: 'white' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2>{isRegister ? 'Registrati' : 'Accedi'}</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
        <button type="submit" style={{ padding: '10px', background: '#2563eb', border: 'none', color: 'white' }}>{loading ? 'Attendere...' : (isRegister ? 'Registrati' : 'Accedi')}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
          {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </button>
        {message && <p style={{ fontSize: '12px', color: '#ffcc00' }}>{message}</p>}
      </form>
    </div>
  );
}
