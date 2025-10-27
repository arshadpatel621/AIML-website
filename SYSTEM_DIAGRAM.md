# System Architecture Diagram

## 🏗️ Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SUPABASE CLOUD                             │
│                                                                     │
│  ┌─────────────────────┐         ┌──────────────────────┐         │
│  │   DATABASE TABLES   │         │  STORAGE BUCKETS     │         │
│  │                     │         │                      │         │
│  │  • faculty          │         │  • faculty-photos    │         │
│  │  • leadership       │         │  • leadership-photos │         │
│  │  • activities       │         │  • activity-images   │         │
│  │  • achievements     │         │  • achievement-images│         │
│  │  • gallery          │         │  • gallery-images    │         │
│  │  • content          │         │                      │         │
│  │  • students         │         │                      │         │
│  └─────────────────────┘         └──────────────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                    ▲                              ▲
                    │                              │
                    │ Read/Write                   │ Image Upload
                    │                              │
        ┌───────────┴──────────┬──────────────────┴────────────┐
        │                      │                                │
        │                      │                                │
        ▼                      ▼                                ▼
┌───────────────┐    ┌──────────────────┐         ┌──────────────────┐
│  ADMIN PANEL  │    │  USER WEBSITE    │         │   VISITOR'S      │
│               │    │                  │         │   BROWSER        │
│ • Login       │    │ • Homepage       │         │                  │
│ • Dashboard   │    │ • Faculty        │         │ • Views content  │
│ • Add Faculty │    │ • Leadership     │         │ • Sees photos    │
│ • Add Activity│    │ • Activities     │         │ • No editing     │
│ • Upload Photo│    │ • Achievements   │         │                  │
│ • Edit Content│    │ • Gallery        │         │                  │
│               │    │ • Contact        │         │                  │
└───────────────┘    └──────────────────┘         └──────────────────┘
```

## 📊 Data Flow Diagram

### When Admin Adds Faculty:

```
┌──────────────┐
│ Admin Panel  │
│ Dashboard    │
└──────┬───────┘
       │
       │ 1. Admin fills form
       │    - Name: "Dr. John"
       │    - Role: "Professor"
       │    - Photo: image.jpg
       │
       ▼
┌──────────────────────┐
│ dashboard.js         │
│ handleFormSubmit()   │
└──────────┬───────────┘
           │
           │ 2. Upload photo
           │
           ▼
┌──────────────────────┐         ┌─────────────────────┐
│ database.js          │    -->  │ Supabase Storage    │
│ uploadImage()        │         │ faculty-photos/     │
└──────────┬───────────┘         │ abc123.jpg          │
           │                     └─────────────────────┘
           │ 3. Get photo URL
           │    https://...abc123.jpg
           │
           ▼
┌──────────────────────┐         ┌─────────────────────┐
│ database.js          │    -->  │ Supabase Database   │
│ addFaculty()         │         │ faculty table       │
└──────────────────────┘         │                     │
                                 │ {                   │
                                 │   name: "Dr. John"  │
                                 │   role: "Professor" │
                                 │   photo_url: "..."  │
                                 │ }                   │
                                 └─────────────────────┘
```

### When User Visits Website:

```
┌──────────────┐
│ User opens   │
│ index.html   │
└──────┬───────┘
       │
       │ 1. Page loads
       │
       ▼
┌──────────────────────┐
│ faculty-loader.js    │
│ loadFacultyData()    │
└──────────┬───────────┘
           │
           │ 2. Fetch data from database
           │
           ▼
┌─────────────────────┐         ┌─────────────────────┐
│ Supabase Database   │    -->  │ faculty-loader.js   │
│ faculty table       │         │                     │
│                     │         │ Receives:           │
│ [                   │         │ [                   │
│   {name: "Dr. John",│         │   {name: "Dr. John",│
│    role: "Prof",    │         │    role: "Prof",    │
│    photo_url: "..." │         │    photo_url: "..." │
│   }                 │         │   }                 │
│ ]                   │         │ ]                   │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           │ 3. Create HTML
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │ User's Browser      │
                                │                     │
                                │ ┌─────────────────┐ │
                                │ │ [Photo]         │ │
                                │ │ Dr. John        │ │
                                │ │ Professor       │ │
                                │ └─────────────────┘ │
                                └─────────────────────┘
```

## 🔄 Complete Workflow Example

### Scenario: Adding a New Faculty Member

```
Step 1: ADMIN LOGS IN
┌─────────────────────────────┐
│ admin/login.html            │
│ ✓ Enter credentials         │
│ ✓ Click Login               │
└─────────────────────────────┘
            │
            ▼
Step 2: OPENS FACULTY SECTION
┌─────────────────────────────┐
│ admin/dashboard.html        │
│ Click "Faculty Management"  │
└─────────────────────────────┘
            │
            ▼
Step 3: ADDS FACULTY
┌─────────────────────────────┐
│ Click "Add Faculty"         │
│ Modal opens:                │
│ • Name: Dr. Sarah Khan      │
│ • Role: Assistant Professor │
│ • Photo: [Choose File]      │
│ Click "Save"                │
└─────────────────────────────┘
            │
            ▼
Step 4: SYSTEM PROCESSES
┌─────────────────────────────┐
│ ⏳ Uploading photo...       │
│ ⏳ Saving to database...    │
│ ✅ Success!                 │
└─────────────────────────────┘
            │
            ▼
Step 5: DATA IN SUPABASE
┌─────────────────────────────┐
│ Database: faculty table     │
│ ┌─────────────────────────┐ │
│ │ id: abc-123             │ │
│ │ name: Dr. Sarah Khan    │ │
│ │ role: Assistant Prof    │ │
│ │ photo_url: https://...  │ │
│ │ created_at: 2025-10-26  │ │
│ └─────────────────────────┘ │
│                             │
│ Storage: faculty-photos     │
│ ┌─────────────────────────┐ │
│ │ xyz789.jpg              │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
            │
            ▼
Step 6: USER VISITS WEBSITE
┌─────────────────────────────┐
│ User opens index.html       │
│ ⏳ Loading...               │
└─────────────────────────────┘
            │
            ▼
Step 7: DATA AUTOMATICALLY LOADS
┌─────────────────────────────┐
│ faculty-loader.js           │
│ ✓ Fetches from database     │
│ ✓ Loads photo URLs          │
│ ✓ Creates HTML cards        │
└─────────────────────────────┘
            │
            ▼
Step 8: USER SEES CONTENT
┌─────────────────────────────┐
│ Faculty Section:            │
│ ┌─────────┬─────────┐       │
│ │ [Photo] │ [Photo] │       │
│ │ Dr. John│Dr. Sarah│       │
│ │Professor│Asst Prof│       │
│ └─────────┴─────────┘       │
└─────────────────────────────┘
```

## 🗂️ File Structure

```
college-website-aiml/
│
├── index.html                      ← User website (main page)
│
├── assets/
│   ├── js/
│   │   ├── main.js                 ← Animations, interactions
│   │   └── faculty-loader.js       ← Loads data from Supabase ★
│   │
│   ├── css/
│   │   └── styles.css              ← Styling
│   │
│   └── img/                        ← Static images (logos, etc)
│
├── admin/
│   ├── login.html                  ← Admin login page
│   ├── dashboard.html              ← Admin dashboard (UI)
│   ├── dashboard.js                ← Admin functionality ★
│   ├── database.js                 ← Database operations ★
│   └── supabase-config.js          ← Supabase connection ★
│
├── create-leadership-table.sql     ← SQL script for leadership ★
├── database-schema.sql             ← All database tables
│
├── DYNAMIC_DATA_SETUP.md           ← Detailed setup guide ★
├── FEATURES_SUMMARY.md             ← Features overview ★
├── SETUP_CHECKLIST.md              ← Quick setup steps ★
└── SYSTEM_DIAGRAM.md               ← This file

★ = Key files for dynamic content system
```

## 🎯 Key Components Explained

### 1. Supabase (Backend)
- **Database**: Stores all data (faculty, activities, etc.)
- **Storage**: Stores all images/photos
- **API**: Provides endpoints to read/write data
- **Authentication**: Handles admin login

### 2. Admin Panel (admin/)
- **Purpose**: For admins to manage content
- **Access**: Password-protected
- **Features**: Add, edit, delete content and photos
- **Files**:
  - `login.html` - Login page
  - `dashboard.html` - Main admin interface
  - `dashboard.js` - Handles user interactions
  - `database.js` - Communicates with Supabase

### 3. User Website (index.html)
- **Purpose**: Public-facing website
- **Access**: Open to everyone (no login)
- **Features**: Displays all content from database
- **Files**:
  - `index.html` - Main HTML structure
  - `faculty-loader.js` - Fetches and displays data
  - `main.js` - Animations and interactions

### 4. Data Flow
```
Admin → Admin Panel → Supabase → User Website → Visitor
```

## 💡 Key Concepts

### Dynamic vs Static Content

**Static (Old Way):**
```html
<!-- Hardcoded in HTML -->
<div class="faculty-card">
  <img src="john.jpg">
  <h3>Dr. John</h3>
  <p>Professor</p>
</div>
```
❌ Problem: Must edit HTML file to change content

**Dynamic (New Way):**
```javascript
// Loaded from database
async function loadFaculty() {
  const data = await fetchFromDatabase();
  createHTMLFromData(data);
}
```
✅ Solution: Edit through admin panel, no code changes

### How Photos Work

```
1. Admin uploads photo
   └─> Goes to Supabase Storage
       └─> Gets public URL
           └─> URL saved in database
               └─> Website loads photo from URL
```

Example URL:
```
https://xyz.supabase.co/storage/v1/object/public/faculty-photos/abc123.jpg
```

## 🔐 Security Model

```
┌──────────────────────────┐
│ PUBLIC (No Login)        │
│ • View website           │
│ • See all content        │
│ • See all photos         │
│ ✅ Can: Read             │
│ ❌ Cannot: Edit/Delete   │
└──────────────────────────┘

┌──────────────────────────┐
│ ADMIN (With Login)       │
│ • Access admin panel     │
│ • Add/edit/delete        │
│ • Upload photos          │
│ ✅ Can: Everything       │
└──────────────────────────┘
```

## 📱 Responsive Flow

```
Desktop                 Tablet                  Mobile
┌─────────────┐        ┌───────────┐          ┌──────┐
│             │        │           │          │      │
│  [Photo]    │        │  [Photo]  │          │[Photo│
│   Name      │   -->  │   Name    │    -->   │ Name │
│   Role      │        │   Role    │          │ Role │
│             │        │           │          │      │
└─────────────┘        └───────────┘          └──────┘

All layouts automatically load from same database!
```

---

**This diagram shows how your complete system works together!**

✨ **Key Takeaway**: Admin edits → Supabase stores → Website displays automatically
