-- RESET AND FIX Student Photos Policies
-- This will remove all old policies and create fresh ones
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Remove ALL existing policies for student-photos bucket
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname LIKE '%student%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Step 2: Create fresh policies

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload to student-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Allow everyone to view photos
CREATE POLICY "Anyone can view student photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update student-photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete from student-photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'student-photos'
  AND auth.role() = 'authenticated'
);

-- Step 3: Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';

-- Step 4: Verify policies were created
SELECT
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%student%';
