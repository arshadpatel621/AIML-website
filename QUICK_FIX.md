# Quick Fix for Database Save Issue

## Problem
Data and images are not being saved because:
1. **Row Level Security (RLS) policies** require authentication, but your admin uses session storage (not Supabase auth)
2. **Storage buckets** may not exist yet

## Solution

### Step 1: Fix Database Policies (REQUIRED)

Go to your Supabase Dashboard and run this SQL:

1. Open https://supabase.com/dashboard
2. Select your project: `nazeyrzodnnvcqwttrvr`
3. Go to **SQL Editor** (left sidebar)
4. Copy and paste the content from `fix-database-policies.sql`
5. Click **Run**

This will allow your admin panel to insert/update/delete data without Supabase authentication.

### Step 2: Create Storage Buckets (REQUIRED for image uploads)

**Option A: Manual (Recommended)**
1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Create these buckets with **Public** toggle ON:
   - `faculty-photos`
   - `activity-images`
   - `images`

**Option B: SQL**
1. Go to **SQL Editor**
2. Run the content from `create-storage-buckets.sql`

### Step 3: Test It

1. Open `admin/login.html`
2. Login with your credentials
3. Go to Faculty section
4. Click "Add Faculty"
5. Fill the form and optionally upload a photo
6. Click "Save Faculty"
7. Check browser console (F12) for detailed logs

You should see:
- ✅ "Faculty added successfully" alert
- ✅ Data appears in the table
- ✅ Data persists in Supabase (check Table Editor > faculty)

### Step 4: Verify in Supabase

1. Go to Supabase Dashboard > **Table Editor**
2. Select the `faculty` table
3. You should see your newly added faculty member

## What Was Fixed

1. **Updated RLS Policies**: Changed from `auth.role() = 'authenticated'` to `true` (allows anonymous access)
2. **Better Error Handling**: Added detailed console logs and error messages in dashboard.js
3. **Loading States**: Added "Saving..." button state during form submission

## Important Note

⚠️ **For Production**: The current setup allows anyone to modify data. For production, you should:
- Implement proper Supabase authentication (email/password or OAuth)
- Restore the `auth.role() = 'authenticated'` policies
- Replace session storage with Supabase auth sessions

## Troubleshooting

### "Error adding faculty member"
- Check browser console for specific error message
- Verify you ran `fix-database-policies.sql`
- Verify tables exist (run `database-schema.sql` if needed)

### "Error uploading photo"
- Check if storage bucket `faculty-photos` exists
- Verify bucket is set to Public
- Check Storage policies (see `create-storage-buckets.sql`)

### Data not appearing
- Hard refresh the page (Ctrl+F5)
- Check if data exists in Supabase Table Editor
- Check browser console for errors
