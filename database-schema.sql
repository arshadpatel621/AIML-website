-- Database Schema for AIML Department Website
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) DEFAULT 'AIML',
    photo_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities Tablea
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE,
    year INT,
    semester INT,
    cgpa DECIMAL(4,2),
    is_topper BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Table (for managing website content)
CREATE TABLE IF NOT EXISTS content (
    id INT PRIMARY KEY DEFAULT 1,
    tagline TEXT,
    description TEXT,
    vision TEXT,
    mission TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Create storage buckets (Run in Supabase Dashboard > Storage)
-- Note: You need to create these buckets manually in Supabase Dashboard:
-- 1. 'images' - for general images
-- 2. 'faculty-photos' - for faculty photos
-- 3. 'activity-images' - for activity images

-- Enable Row Level Security (RLS)
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on faculty"
    ON faculty FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on activities"
    ON activities FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on achievements"
    ON achievements FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on gallery"
    ON gallery FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on students"
    ON students FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on content"
    ON content FOR SELECT
    USING (true);

-- Create policies for authenticated admin access (INSERT, UPDATE, DELETE)
CREATE POLICY "Allow authenticated insert on faculty"
    ON faculty FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on faculty"
    ON faculty FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on faculty"
    ON faculty FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on activities"
    ON activities FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on activities"
    ON activities FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on activities"
    ON activities FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on achievements"
    ON achievements FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on achievements"
    ON achievements FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on achievements"
    ON achievements FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on gallery"
    ON gallery FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on gallery"
    ON gallery FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on gallery"
    ON gallery FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on students"
    ON students FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on students"
    ON students FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on students"
    ON students FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on content"
    ON content FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on content"
    ON content FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO content (id, tagline, description, vision, mission)
VALUES (
    1,
    'Empowering Intelligence Through Innovation.',
    'Artificial Intelligence (AI) and Machine Learning (ML) Course is rapidly growing fields in computer science...',
    'To be a premier center of excellence in Artificial Intelligence...',
    'The mission of the Department of Artificial Intelligence...'
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_faculty_department ON faculty(department);
CREATE INDEX idx_activities_date ON activities(date DESC);
CREATE INDEX idx_achievements_date ON achievements(date DESC);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_students_topper ON students(is_topper) WHERE is_topper = true;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
