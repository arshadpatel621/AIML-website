# Quick Setup Checklist ✅

Follow these steps to enable dynamic content loading from admin panel to user website.

## Prerequisites
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] `admin/supabase-config.js` configured with your credentials

## Step-by-Step Setup

### 1️⃣ Database Setup (5 minutes)

#### Run SQL Script for Leadership Table
- [ ] Go to Supabase Dashboard
- [ ] Click **SQL Editor**
- [ ] Open file: `create-leadership-table.sql`
- [ ] Copy all content
- [ ] Paste in SQL Editor
- [ ] Click **Run** button
- [ ] Verify: Table `leadership` appears in Database → Tables

#### Verify Other Tables Exist
Check in Supabase Dashboard → Database → Tables:
- [ ] `faculty` table exists
- [ ] `activities` table exists
- [ ] `achievements` table exists
- [ ] `gallery` table exists
- [ ] `content` table exists
- [ ] `students` table exists

**If any are missing:** Run `database-schema.sql` in SQL Editor

---

### 2️⃣ Storage Buckets Setup (5 minutes)

Go to Supabase Dashboard → Storage

#### Create Required Buckets
For each bucket below:
1. Click **New bucket**
2. Enter bucket name
3. Check ✅ **Public bucket**
4. Click **Create bucket**

Create these buckets:
- [ ] `faculty-photos` (public)
- [ ] `leadership-photos` (public)
- [ ] `activity-images` (public)
- [ ] `achievement-images` (public)
- [ ] `gallery-images` (public)

**Note:** The SQL script already tries to create `leadership-photos`, but verify it's public.

---

### 3️⃣ Test Admin Panel (5 minutes)

- [ ] Open `admin/login.html` in browser
- [ ] Login with admin credentials
- [ ] Dashboard loads successfully
- [ ] No errors in browser console (F12)

#### Test Each Section:

**Faculty:**
- [ ] Click "Add Faculty"
- [ ] Enter name: "Test Faculty"
- [ ] Select role: "Assistant Professor"
- [ ] Upload a photo
- [ ] Click "Save"
- [ ] Verify: Faculty appears in table
- [ ] No errors in console

**Activities:** (if already working)
- [ ] Try adding a test activity
- [ ] Verify it appears in admin panel

**Achievements:** (if already working)
- [ ] Try uploading a test image
- [ ] Verify it appears in admin panel

**Gallery:** (if already working)
- [ ] Try uploading a test image
- [ ] Verify it appears in admin panel

---

### 4️⃣ Test User Website (5 minutes)

- [ ] Open `index.html` in browser
- [ ] Open browser console (F12)
- [ ] Look for these messages:

```
✅ Loaded X faculty members from database
✅ Loaded X leadership members from database
✅ Loaded X activities from database
✅ Loaded X achievements from database
✅ Loaded X gallery images from database
✅ Content loaded from database
```

- [ ] No errors in console
- [ ] Faculty section shows database data
- [ ] Leadership section shows database data
- [ ] Activities show database data
- [ ] Achievements show database data
- [ ] Gallery shows database images

---

### 5️⃣ Verify Dynamic Updates (3 minutes)

1. **Add New Faculty in Admin:**
   - [ ] Go to admin panel
   - [ ] Add a new faculty member
   - [ ] Save successfully

2. **Check User Website:**
   - [ ] Refresh `index.html`
   - [ ] New faculty member appears
   - [ ] Photo displays correctly

3. **Edit Faculty:**
   - [ ] Edit the faculty member in admin
   - [ ] Change name or role
   - [ ] Save changes
   - [ ] Refresh user website
   - [ ] Changes appear on website

4. **Delete Faculty:**
   - [ ] Delete the test faculty in admin
   - [ ] Confirm deletion
   - [ ] Refresh user website
   - [ ] Faculty no longer appears

---

## Troubleshooting

### ❌ Issue: "Supabase not connected"

**Fix:**
1. Check `admin/supabase-config.js`
2. Verify your Supabase URL and API key are correct
3. Reload page

---

### ❌ Issue: "Policy violation" error when uploading photos

**Fix:**
1. Go to Supabase → Storage
2. Click on the bucket (e.g., `faculty-photos`)
3. Click **Policies** tab
4. Verify these policies exist:
   - SELECT (public read)
   - INSERT (authenticated)
   - UPDATE (authenticated)
   - DELETE (authenticated)
5. If missing, re-run the SQL script

---

### ❌ Issue: Data not appearing on website

**Fix:**
1. Open browser console (F12)
2. Look for error messages
3. Check if Supabase is initialized: `window.supabase` should exist
4. Verify data exists in Supabase Dashboard → Database → Table Editor
5. Check that `assets/js/faculty-loader.js` is loaded

---

### ❌ Issue: Photos not displaying

**Fix:**
1. Check if photo was uploaded successfully in admin panel
2. Go to Supabase → Storage → bucket
3. Verify file exists
4. Check if bucket is public
5. Try accessing the photo URL directly in browser

---

## Final Verification Checklist

After completing all steps above:

- [ ] ✅ All database tables exist
- [ ] ✅ All storage buckets are public
- [ ] ✅ Admin panel loads without errors
- [ ] ✅ Can add/edit/delete data in admin panel
- [ ] ✅ User website loads without errors
- [ ] ✅ Data from admin panel appears on website
- [ ] ✅ Photos display correctly
- [ ] ✅ Changes in admin panel reflect on website after refresh

---

## 🎉 Success!

If all checkboxes are checked, your dynamic content system is working!

**You can now:**
- ✨ Add faculty, leadership, activities through admin panel
- ✨ Upload photos and images
- ✨ Edit content (About, Vision, Mission)
- ✨ All changes appear automatically on user website

**No more manual HTML editing needed!**

---

## Next Steps

1. **Add Real Content:**
   - Remove test data
   - Add all actual faculty members
   - Add all leadership members
   - Upload real activity images
   - Upload achievement images
   - Update content sections

2. **Customize:**
   - Adjust styling if needed
   - Add more sections (optional)
   - Configure admin permissions

3. **Deploy:**
   - Upload to your hosting platform
   - Website will continue to work with Supabase backend

---

## Need Help?

1. Check browser console for errors
2. Check Supabase Dashboard → Logs
3. Review `DYNAMIC_DATA_SETUP.md` for detailed instructions
4. Review `FEATURES_SUMMARY.md` to understand how everything works

---

**Estimated Total Setup Time: 20-25 minutes**

Good luck! 🚀
