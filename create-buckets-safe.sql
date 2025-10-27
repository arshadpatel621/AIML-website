-- Safe Storage Buckets Creation Script
-- This won't cause errors if buckets already exist

-- Create storage buckets (will skip if already exist)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('images', 'images', true),
    ('faculty-photos', 'faculty-photos', true),
    ('activity-images', 'activity-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Check if buckets were created
SELECT 
    id as bucket_name, 
    public as is_public,
    created_at
FROM storage.buckets
WHERE id IN ('images', 'faculty-photos', 'activity-images')
ORDER BY created_at;
