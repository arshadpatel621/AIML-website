# Fix Student Photos Upload Error 🔧

## The Problem
You're getting "Bucket not found" error because the `student-photos` storage bucket doesn't exist in your Supabase project yet.

## Quick Fix (Choose ONE method)

### Method 1: Via Supabase Dashboard (Easiest) ⭐

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login and select your project

2. **Go to Storage**
   - Click "Storage" in the left sidebar

3. **Create New Bucket**
   - Click "New bucket" button
   - Enter name: `student-photos`
   - ✅ Check "Public bucket" (important!)
   - Click "Create bucket"

4. **Done!** Now try uploading a student photo again.

### Method 2: Via SQL Editor (Faster)

1. **Open SQL Editor**
   - Go to Supabase Dashboard
   - Click "SQL Editor" in left sidebar

2. **Run the SQL**
   - Click "New query"
   - Copy and paste this SQL:

```sql
-- Create student-photos storage bucket
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
```

3. **Click "Run"**

4. **Done!** Now try uploading again.

---

## What I've Also Fixed

I've updated the code so now:
- ✅ You get a clearer error message if bucket is missing
- ✅ You can still save students WITHOUT photos (photos are now optional)
- ✅ The system gives you instructions on how to fix the bucket issue

## Testing After Fix

1. **Add a student WITH photo:**
   - Go to admin panel → Students
   - Click "Add Student"
   - Fill in all details + upload a photo
   - Click "Save Student"
   - Photo should upload successfully! ✨

2. **Add a student WITHOUT photo:**
   - Go to admin panel → Students
   - Click "Add Student"
   - Fill in all details (skip photo upload)
   - Click "Save Student"
   - Should save with placeholder image

## Verify It Worked

After creating the bucket:
1. Go to Supabase Dashboard → Storage
2. You should see `student-photos` bucket listed
3. Try uploading a student photo via admin panel
4. Check that the photo appears in the bucket
5. Check that the student appears on the homepage with their photo

## Still Having Issues?

### Error: "Permission denied"
**Fix:** Make sure the bucket is set to PUBLIC
1. Go to Storage → student-photos
2. Click the settings/gear icon
3. Enable "Public bucket"

### Error: "RLS policy violation" or "new row violates row-level security policy" ⚠️
**This is the most common error!**

**Fix:** The bucket exists but doesn't have the right policies.
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL script: `fix-student-photos-rls.sql`
   OR copy the SQL from `FIX_RLS_POLICY_ERROR.md`
3. Click "Run"
4. Try uploading again

**Quick SQL Fix:**
```sql
-- Allow authenticated users to upload
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

-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';
```

### Photos upload but don't show
**Fix:** Check the bucket is public:
1. Storage → student-photos → Configuration
2. Enable "Public bucket"
3. Or run: `UPDATE storage.buckets SET public = true WHERE id = 'student-photos';`

---

**Need Help?** Check the browser console (F12) for detailed error messages.
