# Database Setup Instructions

## ✅ Completed Steps

1. **Supabase Configuration Created** - `admin/supabase-config.js`
2. **Database Helper Functions Created** - `admin/database.js`
3. **Dashboard Connected** - `admin/dashboard.html` now fetches data from Supabase
4. **Dashboard.js Updated** - Now loads and displays real-time data from database

## 🚀 Next Steps: Set Up Your Database

### Step 1: Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `nazeyrzodnnvcqwttrvr`
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the entire content from `database-schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute all commands

This will create:
- ✅ `faculty` table
- ✅ `activities` table
- ✅ `achievements` table
- ✅ `gallery` table
- ✅ `students` table
- ✅ `content` table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance

### Step 2: Create Storage Buckets (Optional - for image uploads)

1. In Supabase Dashboard, go to **Storage** in the left sidebar
2. Click **New bucket**
3. Create these buckets with **Public** access:
   - `images` - for general images
   - `faculty-photos` - for faculty photos
   - `activity-images` - for activity images

### Step 3: Test the Connection

1. Open your website: `admin/login.html`
2. Login with credentials (from `login.js`)
3. Open browser console (F12)
4. You should see: `Supabase connected: true`
5. Navigate to different sections - they will fetch data from your database

## 📊 Available Features

### Dashboard
- ✅ Real-time statistics (faculty, students, activities, achievements counts)
- ✅ Auto-loads data on page load

### Faculty Management
- ✅ View all faculty members from database
- ✅ Add new faculty (with photo upload)
- ✅ Edit existing faculty
- ✅ Delete faculty members
- ✅ Data persists in Supabase

### Activities Management
- ✅ View all activities from database
- ✅ Delete activities
- ✅ Auto-refresh after changes

### Achievements Management
- ✅ View all achievements from database
- ✅ Delete achievements
- ✅ Auto-refresh after changes

### Gallery Management
- ✅ View all gallery images from database
- ✅ Delete images
- ✅ Auto-refresh after changes

### Content Management
- ✅ Load website content from database
- ✅ Edit and save content
- ✅ Updates persist to database

## 🔍 How to Verify It's Working

1. **Check Console Logs**:
   - Open browser console (F12)
   - Look for messages like:
     - "Supabase connected: true"
     - "Dashboard stats loaded: {...}"
     - "Faculty data loaded: X members"

2. **Add Test Data**:
   - Click "Add Faculty" button
   - Fill in the form
   - Submit
   - Check if the new faculty appears in the table

3. **Check Database**:
   - Go to Supabase Dashboard > Table Editor
   - Select the `faculty` table
   - You should see the newly added faculty member

## 🔒 Security Notes

- Row Level Security (RLS) is enabled on all tables
- Public users can **read** data
- Only **authenticated** users can insert/update/delete
- The anon key is safe to use in frontend code
- For production, consider implementing proper authentication

## 🛠️ Troubleshooting

### "relation does not exist" error
- You haven't run the SQL schema yet
- Go to Supabase > SQL Editor and run `database-schema.sql`

### "No data loading"
- Check browser console for errors
- Verify Supabase credentials in `supabase-config.js`
- Check if tables exist in Supabase Dashboard

### "Permission denied" errors
- RLS policies might not be set correctly
- Re-run the SQL schema to create policies

## 📝 Database Schema Overview

```
faculty
├── id (UUID)
├── name
├── role
├── department
├── photo_url
└── timestamps

activities
├── id (UUID)
├── title
├── description
├── image_url
└── timestamps

achievements
├── id (UUID)
├── title
├── image_url
└── timestamps

gallery
├── id (UUID)
├── image_url
├── category
└── timestamp

students
├── id (UUID)
├── name
├── roll_number
├── year/semester
├── cgpa
└── timestamps

content
├── id (always 1)
├── tagline
├── description
├── vision
├── mission
└── timestamp
```

## 🎉 You're All Set!

Once you've run the SQL schema, your dashboard is fully connected to Supabase and ready to manage your college website data!
