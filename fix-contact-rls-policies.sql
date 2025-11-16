-- Fix RLS Policies for Contact Tables
-- Run this in Supabase SQL Editor to fix the "row-level security policy" errors
-- This allows contact form submissions and admin panel updates to work

-- ============================================
-- STEP 1: Drop existing policies
-- ============================================

-- Drop contact_info policies
DROP POLICY IF EXISTS "Allow public read access on contact_info" ON contact_info;
DROP POLICY IF EXISTS "Allow authenticated update on contact_info" ON contact_info;
DROP POLICY IF EXISTS "Allow authenticated insert on contact_info" ON contact_info;

-- Drop contact_messages policies
DROP POLICY IF EXISTS "Allow anonymous insert on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated update on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated delete on contact_messages" ON contact_messages;

-- ============================================
-- STEP 2: Create new working policies
-- ============================================

-- CONTACT_INFO POLICIES
-- Allow public to read contact info (for website display)
CREATE POLICY "Public can read contact_info"
    ON contact_info FOR SELECT
    USING (true);

-- Allow anyone to insert/update contact_info (for admin panel with anon key)
-- Note: In production, you might want to restrict this to authenticated users only
CREATE POLICY "Allow all operations on contact_info"
    ON contact_info FOR ALL
    USING (true)
    WITH CHECK (true);

-- CONTACT_MESSAGES POLICIES
-- Allow anonymous users to insert messages (for contact form)
CREATE POLICY "Anyone can insert contact messages"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to read messages (for admin panel)
-- Also allow anon key to read (in case admin panel uses anon key)
CREATE POLICY "Anyone can read contact messages"
    ON contact_messages FOR SELECT
    USING (true);

-- Allow authenticated users to update messages (for admin panel)
-- Also allow anon key to update (in case admin panel uses anon key)
CREATE POLICY "Anyone can update contact messages"
    ON contact_messages FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete messages (for admin panel)
-- Also allow anon key to delete (in case admin panel uses anon key)
CREATE POLICY "Anyone can delete contact messages"
    ON contact_messages FOR DELETE
    USING (true);

-- ============================================
-- STEP 3: Verify policies are created
-- ============================================

-- You can run this query to verify policies:
-- SELECT * FROM pg_policies WHERE tablename IN ('contact_info', 'contact_messages');

