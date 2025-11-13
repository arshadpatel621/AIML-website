# 🚀 QUICK FIX - Student Photos Not Uploading

## Your Error:
```
❌ Error uploading photo: new row violates row-level security policy
```

## The Fix (2 Minutes):

### Step 1: Open Supabase
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** (left sidebar)

### Step 2: Run This SQL
Click "New query" and paste this:

```sql
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

-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';
```

### Step 3: Click "Run"
Press the "Run" button (or F5)

### Step 4: Test Upload
1. Go back to your admin panel
2. Try adding a student with a photo
3. **It should work now!** ✅

---

## What This Does:
- ✅ Allows logged-in admins to upload photos
- ✅ Allows everyone to view photos on the website
- ✅ Makes the bucket public so photos show on your site

---

## Still Not Working?

### If you get "Policy already exists" error:
Run this first to remove old policies:
```sql
DROP POLICY IF EXISTS "Anyone can view student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to student-photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update student-photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from student-photos" ON storage.objects;
```

Then run the CREATE POLICY commands again.

### If photos upload but don't show:
```sql
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';
```

---

**That's it! Your student photos should now upload successfully!** 🎉
