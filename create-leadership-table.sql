-- Create Leadership table for managing college leadership information
-- Run this in your Supabase SQL Editor

-- Create the leadership table
CREATE TABLE IF NOT EXISTS public.leadership (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    photo_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.leadership
    FOR SELECT
    USING (true);

-- Create policy to allow authenticated insert (for admin)
CREATE POLICY "Allow authenticated insert" ON public.leadership
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow authenticated update (for admin)
CREATE POLICY "Allow authenticated update" ON public.leadership
    FOR UPDATE
    USING (true);

-- Create policy to allow authenticated delete (for admin)
CREATE POLICY "Allow authenticated delete" ON public.leadership
    FOR DELETE
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS leadership_display_order_idx ON public.leadership(display_order);

-- Insert sample leadership data (optional - you can remove this)
INSERT INTO public.leadership (name, position, photo_url, display_order)
VALUES 
    ('Dr. Sardar Balbir Singh', 'Chairman', 'assets/img/leadership/chairman.jpg', 1),
    ('Dr. Reshma Kaur', 'Vice Chairperson', 'assets/img/leadership/vice-chairman.jpg', 2),
    ('Dr. Veena S. Soraganvi', 'Principal', 'assets/img/leadership/principal2.jpg', 3),
    ('Col. Ravideep Singh', 'Director Administration', 'assets/img/leadership/director.jpg', 4)
ON CONFLICT DO NOTHING;

-- Create storage bucket for leadership photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('leadership-photos', 'leadership-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public access to leadership photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'leadership-photos');

-- Create storage policy for authenticated uploads
CREATE POLICY "Authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'leadership-photos');

-- Create storage policy for authenticated updates
CREATE POLICY "Authenticated updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'leadership-photos');

-- Create storage policy for authenticated deletes
CREATE POLICY "Authenticated deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'leadership-photos');
