-- Update Sample Data with Correct Photo Paths
-- Run this in Supabase SQL Editor

-- Clear existing data
DELETE FROM faculty;
DELETE FROM activities;
DELETE FROM achievements;
DELETE FROM content WHERE id = 1;

-- Insert faculty with correct photo paths (relative to admin folder)
INSERT INTO faculty (name, role, department, photo_url) VALUES
('Dr. Dayanand', 'Head of Department', 'AIML', '../assets/img/faculty/hod-aiml.jpg'),
('Dr. Jasmineet Kaur', 'Assistant Professor', 'AIML', '../assets/img/faculty/jasmineet-kaur.jpg'),
('Prof. Netravati Sawale', 'Assistant Professor', 'AIML', '../assets/img/faculty/nitraviti mam.png'),
('Prof. Rony Preetam', 'Assistant Professor', 'AIML', '../assets/img/faculty/Rony preetam prakash.png'),
('Prof. Shruti Patil', 'Assistant Professor', 'AIML', '../assets/img/faculty/shruti patil.png'),
('Prof. Ashwini Biradar', 'Assistant Professor', 'AIML', '../assets/img/faculty/ashwini mam.png'),
('Prof. Nasreen Kausar', 'Assistant Professor', 'AIML', '../assets/img/faculty/nasreen mam.png'),
('Prof. Akash', 'Assistant Professor', 'AIML', '../assets/img/faculty/akash sir.png');

-- Insert activities with correct paths
INSERT INTO activities (title, description, image_url) VALUES
('Deep Learning Workshop', 'Hands-on sessions on CNNs and transfer learning.', '../assets/img 3.jpeg'),
('AI Hackathon', '48-hour challenge building end-to-end ML solutions.', '../assets/img.jpeg'),
('Industry Talks', 'Leaders from AI startups and MNCs share insights.', '../assets/img 2.jpeg');

-- Insert achievements with correct paths
INSERT INTO achievements (title, image_url) VALUES
('Smart India Hackathon Winners', '../assets/img 4.jpeg'),
('Research Publications', '../assets/img 5.jpeg'),
('Innovation Grants', '../assets/img 6.jpeg');

-- Insert default content
INSERT INTO content (id, tagline, description, vision, mission) VALUES
(1, 
 '💡 "Empowering Intelligence Through Innovation."',
 'Artificial Intelligence (AI) and Machine Learning (ML) Course is rapidly growing fields in computer science that are revolutionizing the way we interact with technology. AI involves creating intelligent systems that can perform tasks that typically require human-like intelligence. ML, on the other hand, is a subset of AI that involves developing algorithms and models that can learn from data and make predictions or decisions based on that learning.',
 'To be a premier center of excellence in Artificial Intelligence and Machine Learning education, fostering innovation and research to create future leaders in the field.',
 'The mission of the Department of Artificial Intelligence is to provide quality education, conduct cutting-edge research, and foster innovation in AI/ML technologies. We aim to develop skilled professionals who can contribute to society through intelligent system development.'
) ON CONFLICT (id) DO UPDATE SET
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  vision = EXCLUDED.vision,
  mission = EXCLUDED.mission,
  updated_at = NOW();
