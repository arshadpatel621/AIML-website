-- Fix RLS Policies to Allow Anon Key Operations
-- This allows the admin panel to work with the anon key

-- Drop existing restrictive policies
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

DROP POLICY IF EXISTS "Allow authenticated insert on content" ON content;
DROP POLICY IF EXISTS "Allow authenticated update on content" ON content;

-- Create new permissive policies that allow all operations
-- Note: For production, you should implement proper authentication

-- Faculty policies
CREATE POLICY "Allow all operations on faculty"
    ON faculty
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Activities policies
CREATE POLICY "Allow all operations on activities"
    ON activities
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Achievements policies
CREATE POLICY "Allow all operations on achievements"
    ON achievements
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Gallery policies
CREATE POLICY "Allow all operations on gallery"
    ON gallery
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Students policies
CREATE POLICY "Allow all operations on students"
    ON students
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Content policies
CREATE POLICY "Allow all operations on content"
    ON content
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify policies are set
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
