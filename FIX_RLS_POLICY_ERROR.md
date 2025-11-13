# Fix "Row-Level Security Policy" Error for Student Photos 🔒

## The Problem
You're getting this error:
```
Error uploading photo: new row violates row-level security policy
```

This means the `student-photos` bucket exists, but **RLS policies are blocking uploads**.

---

## Quick Fix (2 Methods)

### Method 1: Run SQL Script (Recommended) ⭐

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login and select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste This SQL**
```sql
-- Fix RLS Policies for student-photos Storage Bucket

-- Step 1: Drop existing policies (to avoid conflicts)
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
```

4. **Click "Run" (or press F5)**

5. **Done!** ✅ Now try uploading a student photo again

---

### Method 2: Via Supabase Dashboard UI

1. **Go to Storage**
   - Supabase Dashboard → Storage
   - Click on `student-photos` bucket

2. **Click "Policies" Tab**
   - Look for the "Policies" or "Configuration" section

3. **Create These Policies:**

   **Policy 1 - Read Access**
   - Click "New Policy"
   - Name: `Anyone can view student photos`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     bucket_id = 'student-photos'
     ```

   **Policy 2 - Upload Access**
   - Click "New Policy"
   - Name: `Authenticated users can upload`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     bucket_id = 'student-photos' AND auth.role() = 'authenticated'
     ```

   **Policy 3 - Update Access**
   - Click "New Policy"
   - Name: `Authenticated users can update`
   - Allowed operation: `UPDATE`
   - Policy definition:
     ```sql
     bucket_id = 'student-photos' AND auth.role() = 'authenticated'
     ```

   **Policy 4 - Delete Access**
   - Click "New Policy"
   - Name: `Authenticated users can delete`
   - Allowed operation: `DELETE`
   - Policy definition:
     ```sql
     bucket_id = 'student-photos' AND auth.role() = 'authenticated'
     ```

4. **Make Bucket Public**
   - Go to bucket settings/configuration
   - Enable "Public bucket"

5. **Done!** ✅

---

## Verify It's Fixed

### Test Upload:
1. Go to your admin panel
2. Click "Students" → "Add Student"
3. Fill in student details
4. **Upload a photo** 📸
5. Click "Save Student"
6. **Success!** Photo should upload without errors

### Check Database:
1. Go to Supabase Dashboard → Storage → student-photos
2. You should see the uploaded photo file
3. Click on it to verify it's accessible

### Check Frontend:
1. Open your website `index.html`
2. Scroll to "Students & Toppers" section
3. The student photo should display correctly

---

## Why Did This Happen?

Supabase uses **Row Level Security (RLS)** to protect your data. By default:
- ❌ Buckets are **private** (no one can access)
- ❌ No policies = no one can upload/read

We need to:
- ✅ Create policies to allow authenticated admins to upload
- ✅ Allow everyone to view photos (for the public website)
- ✅ Make the bucket public

---

## Still Having Issues?

### Error: "JWT expired" or "Invalid JWT"
**Solution:** Your login session expired
1. Logout from admin panel
2. Login again
3. Try uploading again

### Error: "Bucket not found"
**Solution:** Bucket name is wrong
1. Go to Storage → Check bucket name
2. Make sure it's exactly: `student-photos` (with hyphen, not underscore)

### Photos upload but don't show on website
**Solution:** Bucket not public
1. Run this SQL:
```sql
UPDATE storage.buckets
SET public = true
WHERE id = 'student-photos';
```

### Error: "Permission denied"
**Solution:** RLS policies not set correctly
1. Re-run the SQL script from Method 1 above
2. Make sure all 4 policies are created

---

## Quick Checklist ✅

After running the fix, verify:
- [ ] SQL executed without errors
- [ ] Bucket is set to public
- [ ] 4 RLS policies created (SELECT, INSERT, UPDATE, DELETE)
- [ ] Can upload photo from admin panel
- [ ] Photo appears in Storage bucket
- [ ] Photo displays on website

---

**Need Help?**
- Check browser console (F12) for detailed errors
- Check Supabase logs: Dashboard → Logs → Storage
