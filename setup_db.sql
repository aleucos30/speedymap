CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT,
    status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS public.stops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    delivery_id UUID REFERENCES public.deliveries(id),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    sequence_order INT
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "Public Read Stops" ON public.stops FOR SELECT USING (true);
