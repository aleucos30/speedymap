import { createClient } from '@supabase/supabase-js';

// Recupero sicuro delle variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Creazione e asportazione di una singola istanza riutilizzabile in tutta l'app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
