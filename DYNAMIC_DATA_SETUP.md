# Dynamic Data Loading Setup Guide

This guide explains how to set up your website so that all content added in the admin panel automatically appears on the user-facing website.

## 🎯 What's Dynamic Now

After following this setup, the following sections will load dynamically from the admin panel:

1. **Leadership** - Chairman, Vice Chairman, Principal, Director, etc.
2. **Faculty** - All faculty members with photos
3. **Activities** - Department activities with images
4. **Achievements** - Achievement images
5. **Gallery** - Department gallery images
6. **Content** - About Us, Vision, Mission, Tagline

## 📋 Setup Steps

### Step 1: Create Leadership Table in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `create-leadership-table.sql`
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click **Run** to execute

This will:
- Create the `leadership` table
- Set up permissions (RLS policies)
- Create the `leadership-photos` storage bucket
- Insert sample leadership data (optional)

### Step 2: Verify Storage Buckets

Make sure you have the following storage buckets in Supabase (Storage section):

| Bucket Name | Public Access | Purpose |
|------------|--------------|---------|
| `faculty-photos` | ✅ Yes | Faculty member photos |
| `leadership-photos` | ✅ Yes | Leadership photos |
| `activity-images` | ✅ Yes | Activity photos |
| `achievement-images` | ✅ Yes | Achievement photos |
| `gallery-images` | ✅ Yes | Gallery photos |

**To create a bucket:**
1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Enter the bucket name
4. Check **Public bucket**
5. Click **Create bucket**

### Step 3: Verify Database Tables

Make sure you have these tables in your Supabase database:

- ✅ `faculty` - For faculty members
- ✅ `leadership` - For leadership team (created in Step 1)
- ✅ `activities` - For department activities
- ✅ `achievements` - For achievements
- ✅ `gallery` - For gallery images
- ✅ `content` - For editable content (About, Mission, Vision)
- ✅ `students` - For student information

If any are missing, check your `database-schema.sql` file and run it.

### Step 4: Test the Admin Panel

1. Open `admin/dashboard.html` in your browser
2. Login with your admin credentials
3. Try adding data to each section:
   - Add a faculty member with photo
   - Add an activity with image
   - Add an achievement image
   - Upload gallery images

### Step 5: Verify Data Appears on Website

1. Open `index.html` in your browser
2. Check if the data you added in admin panel appears on the website
3. You should see console messages like:
   ```
   ✅ Loaded 10 faculty members from database
   ✅ Loaded 4 leadership members from database
   ✅ Loaded 6 activities from database
   ✅ Loaded 5 achievements from database
   ✅ Loaded 6 gallery images from database
   ✅ Content loaded from database
   ```

## 🔧 How It Works

### Frontend (User Website)

The file `assets/js/faculty-loader.js` automatically loads data when the page loads:

```javascript
// Loads faculty from database
(async function loadFacultyData() { ... })();

// Loads leadership from database
(async function loadLeadershipData() { ... })();

// Loads activities from database
(async function loadActivitiesData() { ... })();

// Loads achievements from database
(async function loadAchievementsData() { ... })();

// Loads gallery images from database
(async function loadGalleryData() { ... })();

// Loads content from database
(async function loadContentData() { ... })();
```

### Admin Panel

The file `admin/database.js` provides functions to:
- Add, update, delete data
- Upload images to storage
- Fetch data for display

## 📸 Adding Photos in Admin Panel

### Faculty/Leadership Photos
1. Click "Add Faculty" or "Add Leadership"
2. Fill in name and role/position
3. Click "Choose File" to upload photo
4. Photo is automatically uploaded to Supabase Storage
5. Data is saved with photo URL

### Activity/Achievement Images
1. Click "Add Activity" or "Add Achievement"
2. Upload image
3. Image is stored in appropriate bucket
4. URL is saved in database

## 🎨 Fallback Behavior

If data is not available in the database:
- The website shows the **static/hardcoded content** from `index.html`
- No errors appear to users
- Console shows: "Using static content" message

This means your website will always work, even if:
- Database connection fails
- No data has been added yet
- Supabase is temporarily down

## 🔍 Troubleshooting

### Issue: Photos not uploading

**Solution:**
1. Check if storage bucket exists and is public
2. Go to Storage → Select bucket → Configuration
3. Make sure "Public bucket" is enabled
4. Check RLS policies allow uploads

### Issue: Data not appearing on website

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check if Supabase is connected: Look for `Supabase connected: true`
4. Verify data exists in Supabase dashboard

### Issue: "Policy violation" errors

**Solution:**
1. Go to Supabase Dashboard → Authentication → Policies
2. Check that RLS policies exist for:
   - Public SELECT (read) access
   - Authenticated INSERT/UPDATE/DELETE access
3. Re-run the SQL scripts if needed

## 📊 Storage Bucket Configuration

For each bucket, set these policies in Supabase:

**SELECT (Read) Policy:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'your-bucket-name');
```

**INSERT Policy:**
```sql
CREATE POLICY "Authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'your-bucket-name');
```

**UPDATE/DELETE Policies:** Similar to above

## 🚀 Next Steps

1. **Add Content**: Go to admin panel and start adding:
   - Faculty members
   - Leadership team
   - Activities
   - Achievements
   - Gallery images

2. **Customize**: Edit the admin dashboard to match your needs

3. **Deploy**: Once everything works locally, deploy to your hosting platform

## 📝 Important Notes

- All changes in admin panel appear **instantly** on the website (after page refresh)
- Photos are stored in Supabase Storage (not your server)
- Old hardcoded content in `index.html` is replaced by database content
- You can always edit database content through admin panel
- No coding needed after initial setup!

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase dashboard for data
3. Verify all storage buckets are public
4. Make sure RLS policies are set correctly
5. Check that `admin/supabase-config.js` has correct credentials

---

**✨ Your website is now fully dynamic! Content added in admin panel will automatically appear on the user website.**
