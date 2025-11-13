-- Fix RLS Policies for student-photos Storage Bucket
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access for student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete student photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- Step 2: Create new policies for student-photos bucket

-- Allow EVERYONE to read (view) student photos
CREATE POLICY "Anyone can view student photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');

-- Allow AUTHENTICATED users to upload student photos
CREATE POLICY "Authenticated users can upload to student-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Allow AUTHENTICATED users to update student photos
CREATE POLICY "Authenticated users can update student-photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Allow AUTHENTICATED users to delete student photos
CREATE POLICY "Authenticated users can delete from student-photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Step 3: Make sure the bucket itself is public
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';

-- Done! Try uploading a photo now.
