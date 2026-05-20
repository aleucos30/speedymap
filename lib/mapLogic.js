import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const addStop = async (deliveryId, lat, lng, address) => {
    const { data, error } = await supabase
        .from('stops')
        .insert([{ delivery_id: deliveryId, lat, lng, address, status: 'pending' }]);
    
    if (error) console.error('Errore inserimento tappa:', error);
    return data;
};

export const getRoute = async (deliveryId) => {
    const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('delivery_id', deliveryId)
        .order('sequence_order', { ascending: true });
    
    return data;
};
