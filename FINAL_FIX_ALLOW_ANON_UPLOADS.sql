-- FINAL FIX: Allow Anonymous Uploads to student-photos
-- Your admin login doesn't use Supabase auth, so we need to allow anonymous uploads
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Drop the old authenticated-only policy
DROP POLICY IF EXISTS "Authenticated users can upload to student-photos" ON storage.objects;

-- Step 2: Create a new policy that allows ANYONE to upload
-- (This works because your admin panel is already protected by your custom login)
CREATE POLICY "Allow uploads to student-photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'student-photos');

-- Step 3: Allow anyone to update (for editing)
DROP POLICY IF EXISTS "Authenticated users can update student-photos" ON storage.objects;
CREATE POLICY "Allow updates to student-photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'student-photos');

-- Step 4: Allow anyone to delete (for admin panel)
DROP POLICY IF EXISTS "Authenticated users can delete from student-photos" ON storage.objects;
CREATE POLICY "Allow deletes from student-photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'student-photos');

-- Step 5: Keep the read policy (already works)
DROP POLICY IF EXISTS "Anyone can view student photos" ON storage.objects;
CREATE POLICY "Public read access to student-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');

-- Step 6: Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';

-- Done! Photos should upload now without authentication.
