-- Reset and Create Tables Fresh
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (be careful - this deletes data!)
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS content CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Faculty Table
CREATE TABLE faculty (
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

-- Activities Table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students Table
CREATE TABLE students (
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

-- Content Table
CREATE TABLE content (
    id INT PRIMARY KEY DEFAULT 1,
    tagline TEXT,
    description TEXT,
    vision TEXT,
    mission TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read on faculty" ON faculty;
DROP POLICY IF EXISTS "Allow public read on activities" ON activities;
DROP POLICY IF EXISTS "Allow public read on achievements" ON achievements;
DROP POLICY IF EXISTS "Allow public read on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow public read on students" ON students;
DROP POLICY IF EXISTS "Allow public read on content" ON content;

DROP POLICY IF EXISTS "Allow anon insert on faculty" ON faculty;
DROP POLICY IF EXISTS "Allow anon update on faculty" ON faculty;
DROP POLICY IF EXISTS "Allow anon delete on faculty" ON faculty;

DROP POLICY IF EXISTS "Allow anon insert on activities" ON activities;
DROP POLICY IF EXISTS "Allow anon update on activities" ON activities;
DROP POLICY IF EXISTS "Allow anon delete on activities" ON activities;

DROP POLICY IF EXISTS "Allow anon insert on achievements" ON achievements;
DROP POLICY IF EXISTS "Allow anon update on achievements" ON achievements;
DROP POLICY IF EXISTS "Allow anon delete on achievements" ON achievements;

DROP POLICY IF EXISTS "Allow anon insert on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow anon update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow anon delete on gallery" ON gallery;

DROP POLICY IF EXISTS "Allow anon insert on students" ON students;
DROP POLICY IF EXISTS "Allow anon update on students" ON students;
DROP POLICY IF EXISTS "Allow anon delete on students" ON students;

DROP POLICY IF EXISTS "Allow anon insert on content" ON content;
DROP POLICY IF EXISTS "Allow anon update on content" ON content;

-- Create policies for public read access
CREATE POLICY "Allow public read on faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "Allow public read on activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow public read on achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow public read on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read on students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public read on content" ON content FOR SELECT USING (true);

-- Create policies for anon key (allows insert/update/delete)
CREATE POLICY "Allow anon insert on faculty" ON faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on faculty" ON faculty FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on faculty" ON faculty FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on activities" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on activities" ON activities FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on activities" ON activities FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on achievements" ON achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on achievements" ON achievements FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on achievements" ON achievements FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on gallery" ON gallery FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on students" ON students FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on students" ON students FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on content" ON content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on content" ON content FOR UPDATE USING (true);

-- Insert sample data
INSERT INTO faculty (name, role, department, photo_url) VALUES
('Dr. Dayanand', 'Head of Department', 'AIML', 'assets/img/faculty/hod-aiml.jpg'),
('Dr. Jasmineet Kaur', 'Assistant Professor', 'AIML', 'assets/img/faculty/jasmineet-kaur.jpg');

INSERT INTO activities (title, description, image_url) VALUES
('Deep Learning Workshop', 'Hands-on sessions on CNNs and transfer learning.', 'assets/img 3.jpeg'),
('AI Hackathon', '48-hour challenge building end-to-end ML solutions.', 'assets/img.jpeg'),
('Industry Talks', 'Leaders from AI startups and MNCs share insights.', 'assets/img 2.jpeg');

INSERT INTO achievements (title, image_url) VALUES
('Smart India Hackathon Winners', 'assets/img 4.jpeg'),
('Research Publications', 'assets/img 5.jpeg'),
('Innovation Grants', 'assets/img 6.jpeg');

INSERT INTO content (id, tagline, description, vision, mission) VALUES
(1, 
 'Empowering Intelligence Through Innovation.',
 'Artificial Intelligence (AI) and Machine Learning (ML) Course is rapidly growing fields in computer science that are revolutionizing the way we interact with technology.',
 'To be a premier center of excellence in Artificial Intelligence and Machine Learning education.',
 'The mission of the Department of Artificial Intelligence is to provide quality education and foster innovation in AI/ML technologies.'
);
