-- Create Storage Buckets for AIML Department Website
-- Run this in Supabase Dashboard > SQL Editor

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('images', 'images', true),
    ('faculty-photos', 'faculty-photos', true),
    ('activity-images', 'activity-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for public read access
CREATE POLICY "Public Access for images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

CREATE POLICY "Public Access for faculty-photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'faculty-photos' );

CREATE POLICY "Public Access for activity-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'activity-images' );

-- Create policies for authenticated insert (upload)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( 
    bucket_id = 'images' 
    AND auth.role() = 'authenticated' 
);

CREATE POLICY "Authenticated users can upload faculty photos"
ON storage.objects FOR INSERT
WITH CHECK ( 
    bucket_id = 'faculty-photos' 
    AND auth.role() = 'authenticated' 
);

CREATE POLICY "Authenticated users can upload activity images"
ON storage.objects FOR INSERT
WITH CHECK ( 
    bucket_id = 'activity-images' 
    AND auth.role() = 'authenticated' 
);

-- Create policies for authenticated update
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can update faculty photos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'faculty-photos' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can update activity images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'activity-images' AND auth.role() = 'authenticated' );

-- Create policies for authenticated delete
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can delete faculty photos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'faculty-photos' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can delete activity images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'activity-images' AND auth.role() = 'authenticated' );
