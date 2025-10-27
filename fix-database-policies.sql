-- Fix Database RLS Policies for Development
-- Run this in Supabase Dashboard > SQL Editor
-- This removes the authentication requirement for development

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated insert on faculty" ON faculty;
DROP POLICY IF EXISTS "Allow authenticated update on faculty" ON faculty;
DROP POLICY IF EXISTS "Allow authenticated delete on faculty" ON faculty;

DROP POLICY IF EXISTS "Allow authenticated insert on activities" ON activities;
DROP POLICY IF EXISTS "Allow authenticated update on activities" ON activities;
DROP POLICY IF EXISTS "Allow authenticated delete on activities" ON activities;

DROP POLICY IF EXISTS "Allow authenticated insert on achievements" ON achievements;
DROP POLICY IF EXISTS "Allow authenticated update on achievements" ON achievements;
DROP POLICY IF EXISTS "Allow authenticated delete on achievements" ON achievements;

DROP POLICY IF EXISTS "Allow authenticated insert on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated delete on gallery" ON gallery;

DROP POLICY IF EXISTS "Allow authenticated insert on students" ON students;
DROP POLICY IF EXISTS "Allow authenticated update on students" ON students;
DROP POLICY IF EXISTS "Allow authenticated delete on students" ON students;

DROP POLICY IF EXISTS "Allow authenticated update on content" ON content;
DROP POLICY IF EXISTS "Allow authenticated insert on content" ON content;

-- Create permissive policies for development (allows anonymous access)
-- FACULTY
CREATE POLICY "Allow public insert on faculty"
    ON faculty FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on faculty"
    ON faculty FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on faculty"
    ON faculty FOR DELETE
    USING (true);

-- ACTIVITIES
CREATE POLICY "Allow public insert on activities"
    ON activities FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on activities"
    ON activities FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on activities"
    ON activities FOR DELETE
    USING (true);

-- ACHIEVEMENTS
CREATE POLICY "Allow public insert on achievements"
    ON achievements FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on achievements"
    ON achievements FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on achievements"
    ON achievements FOR DELETE
    USING (true);

-- GALLERY
CREATE POLICY "Allow public insert on gallery"
    ON gallery FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on gallery"
    ON gallery FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on gallery"
    ON gallery FOR DELETE
    USING (true);

-- STUDENTS
CREATE POLICY "Allow public insert on students"
    ON students FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on students"
    ON students FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on students"
    ON students FOR DELETE
    USING (true);

-- CONTENT
CREATE POLICY "Allow public update on content"
    ON content FOR UPDATE
    USING (true);

CREATE POLICY "Allow public insert on content"
    ON content FOR INSERT
    WITH CHECK (true);

-- Note: These policies allow anyone to modify data
-- For production, you should implement proper Supabase authentication
-- and restore the auth.role() = 'authenticated' checks
