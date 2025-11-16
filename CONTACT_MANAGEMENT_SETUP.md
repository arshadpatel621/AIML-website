# Contact Management Feature - Setup Guide

## Overview

A comprehensive Contact Management system has been added to the admin panel, allowing administrators to:
- Manage contact details (address, phone, email, office hours, etc.)
- View and manage contact messages from the website
- Filter messages by status (New, Read, Replied, Archived)
- Add admin notes to messages
- Track message status

## Database Setup

### Step 1: Run SQL Script

Run the SQL script in your Supabase SQL Editor to create the necessary tables:

```sql
-- File: create-contact-tables.sql
```

This will create:
- `contact_info` table - Stores department contact information
- `contact_messages` table - Stores messages from the contact form
- Row Level Security (RLS) policies for proper access control
- Indexes for better performance

### Step 2: Verify Tables

After running the SQL script, verify that both tables exist in your Supabase database:
1. Go to Supabase Dashboard → Table Editor
2. Check for `contact_info` and `contact_messages` tables
3. Verify that RLS is enabled on both tables

## Admin Panel Features

### Contact Information Management

1. **Navigate to Contact Section**
   - Open admin dashboard (`admin/dashboard.html`)
   - Click on "Contact" in the sidebar

2. **Manage Contact Details**
   - Update Address, Phone, Email, Alternate Email, Website, Office Hours
   - Click "Save Contact Info" to update
   - Changes are immediately saved to the database

### Contact Messages Management

1. **View Messages**
   - All messages are displayed in the Contact section
   - Messages are sorted by most recent first
   - New messages are highlighted with a blue left border

2. **Filter Messages**
   - Use filter buttons: All, New, Read, Replied, Archived
   - Click on a filter to show messages of that status

3. **View Message Details**
   - Click "View" button on any message
   - Modal shows full message details, sender info, and timestamp
   - Admin notes can be added/edited in the modal

4. **Message Actions**
   - **Mark as Read**: Changes status from "new" to "read"
   - **Mark as Replied**: Marks message as replied with timestamp
   - **Archive**: Moves message to archived status
   - **Save Notes**: Save internal admin notes about the message
   - **Delete**: Permanently delete a message

5. **Refresh Messages**
   - Click the "Refresh" button to reload messages from database

## Website Contact Form

### How It Works

1. **User Submits Form**
   - User fills out contact form on the website
   - Form validates name, email, and message
   - On submit, message is saved directly to the database

2. **Form Submission**
   - Messages are automatically saved with status "new"
   - User sees success/error message after submission
   - No page reload required (AJAX submission)

3. **Admin Notifications**
   - Admin can view new messages in the admin panel
   - New messages are highlighted and easily identifiable

## Files Created/Modified

### Created Files:
- `create-contact-tables.sql` - Database schema for contact tables
- `assets/js/contact-form.js` - Frontend contact form handler
- `CONTACT_MANAGEMENT_SETUP.md` - This setup guide

### Modified Files:
- `admin/dashboard.html` - Added Contact section UI
- `admin/dashboard.js` - Added contact management JavaScript
- `admin/database.js` - Added contact database functions
- `admin/dashboard.css` - Added contact section styles
- `index.html` - Updated contact form and added script
- `assets/css/styles.css` - Added contact form status styles

## Database Functions Added

### Contact Info Functions:
- `fetchContactInfo()` - Fetch contact information
- `updateContactInfo()` - Update contact information

### Contact Messages Functions:
- `fetchContactMessages(filter)` - Fetch messages with optional filter
- `addContactMessage()` - Add new message (used by website form)
- `updateContactMessage()` - Update message status/notes
- `deleteContactMessage()` - Delete a message

## Security

### Row Level Security (RLS) Policies:

1. **Contact Info**
   - Public read access (for displaying on website)
   - Authenticated admin write access (for updates)

2. **Contact Messages**
   - Anonymous insert access (for contact form submissions)
   - Authenticated admin read/write/delete access

## Testing

### Test Contact Form:
1. Open the website (`index.html`)
2. Navigate to Contact section
3. Fill out and submit the form
4. Check admin panel to see the message appear

### Test Admin Panel:
1. Login to admin dashboard
2. Navigate to Contact section
3. Update contact information
4. View, filter, and manage messages
5. Test message status changes

## Troubleshooting

### Messages Not Appearing:
- Check if `contact_messages` table exists
- Verify RLS policies are correct
- Check browser console for errors
- Ensure Supabase connection is working

### Form Not Submitting:
- Check browser console for errors
- Verify Supabase client is loaded
- Check network tab for API calls
- Ensure RLS allows anonymous inserts

### Contact Info Not Saving:
- Verify admin is logged in
- Check RLS policies for authenticated users
- Check browser console for errors

## Next Steps

1. Run the SQL script to create tables
2. Test the contact form on the website
3. Test admin panel message management
4. Customize contact information as needed
5. Set up email notifications (optional future enhancement)

## Future Enhancements (Optional)

- Email notifications when new messages arrive
- Message search functionality
- Export messages to CSV
- Bulk message actions
- Auto-reply functionality
- Message templates for replies

