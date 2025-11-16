-- Contact Management Tables for AIML Department Website
-- Run these commands in your Supabase SQL Editor

-- Contact Info Table (stores department contact details)
CREATE TABLE IF NOT EXISTS contact_info (
    id INT PRIMARY KEY DEFAULT 1,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    alternate_email VARCHAR(255),
    website VARCHAR(255),
    office_hours TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Contact Messages Table (stores messages from contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    replied_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Contact Info Policies
-- Public read access (for displaying on website)
CREATE POLICY "Allow public read access on contact_info"
    ON contact_info FOR SELECT
    USING (true);

-- Authenticated admin can update contact info
CREATE POLICY "Allow authenticated update on contact_info"
    ON contact_info FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on contact_info"
    ON contact_info FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Contact Messages Policies
-- Allow anonymous insert (for contact form submissions)
CREATE POLICY "Allow anonymous insert on contact_messages"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

-- Authenticated admin can view all messages
CREATE POLICY "Allow authenticated read on contact_messages"
    ON contact_messages FOR SELECT
    USING (auth.role() = 'authenticated');

-- Authenticated admin can update messages (mark as read, add notes, etc.)
CREATE POLICY "Allow authenticated update on contact_messages"
    ON contact_messages FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated admin can delete messages
CREATE POLICY "Allow authenticated delete on contact_messages"
    ON contact_messages FOR DELETE
    USING (auth.role() = 'authenticated');

-- Insert default contact info
INSERT INTO contact_info (id, address, phone, email, alternate_email, website, office_hours)
VALUES (
    1,
    'Guru Nanak Dev Engineering College Mailoor Road, Bidar, KA-585403',
    '+918482-226949',
    'principalgndecb@gmail.com',
    'principal@gndecb.ac.in',
    'https://www.gndecb.ac.in',
    'Monday - Friday: 9:00 AM - 5:00 PM'
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- Add trigger to update updated_at for contact_messages
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to update updated_at for contact_info
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

