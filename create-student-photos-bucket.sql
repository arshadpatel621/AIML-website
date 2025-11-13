-- Create student-photos storage bucket
-- Run this in Supabase Dashboard → SQL Editor

-- Create the bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for public read access
CREATE POLICY "Public Access for student photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload student photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update student photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'student-photos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete student photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'student-photos' AND auth.role() = 'authenticated');
