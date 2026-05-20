const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
    // Sostituisci 'routes' con il nome corretto della tua tabella se diverso
    const { data, error } = await supabase.from('routes').select('*');
    if (error) console.error('Errore Database:', error.message);
    else console.log('Dati trovati:', data.length, 'righe.');
}

checkData();
